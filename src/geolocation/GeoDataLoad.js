import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Button, Divider, Dimmer, Table, Loader, Message, Container, Form, Select, Header } from 'semantic-ui-react'
import GeoExplMap from './GeoExplMap'
import GeoMappableStats from './GeoMappableStats'


const GeoDataLoad = () => {

    const [userFileName, setUserFileName] = useState('anon_rosterm_id')

    const [userLat, setUserLat] = useState('GCcleanPOBlat')
    const [userLong, setUserLong] = useState('GCcleanPOBlon')

    const [datasetRes, setDatasetRes] = useState(null)
    const [userMap, setUserMap] = useState(null)
    const [unmapIndex, setUnmapIndex] = useState(null)
    const [reducedData, setReducedData] = useState(null)
    const [reducedDataLatsLongs, setReducedDataLatsLongs] = useState(null)


    const projection = d3.geoMercator()

    const getReducedDataset = (result) => {

        const unmapString = result[3].join('-')
        const reducedLatsLongs = []

        fetch(`/geo_file1/${unmapString}/${userFileName}`).then(res => res.json()).then(data => {
            d3.csv(process.env.PUBLIC_URL + data['reduced-data'][0]).then(data => {

                setReducedData(data)

                data.map((item, index) => {
                    reducedLatsLongs.push([projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[0], projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[1]])
                })
            })
        }).then(setReducedDataLatsLongs(reducedLatsLongs))
    }

    const processDataset = (dataset) => {

        // keeping track of initial dataset length
        const userDataLen = dataset.length
        //items that can not be plotted by d3
        const unmapItems = []
        // items that don't contain lat & long
        const absentCoordinates = []
        // indexes of items that can't be plotted and don't have coordinates
        const unmapIndex = []
        // array containing only lats and longs of mappable items, for delaunay calculations later
        const mappableLatsLongs = []
        // array containing mappable items with all columns
        const mappableFull = []
        // columns
        const columns = dataset.columns


        dataset.map((item, index) => {


            if (isNaN(projection([+item[userLong], +item[userLat]])[0]) || isNaN(projection([+item[userLong], +item[userLat]])[1])) {
                unmapItems.push(item)
                unmapIndex.push(index)
            }

            else if (+item[userLong] === 0 || +item[userLat] === 0 || +item[userLong] === '' || +item[userLat] === '') {
                absentCoordinates.push(item)
                unmapIndex.push(index)
            }

            else {
                mappableLatsLongs.push([projection([+item[userLong], +item[userLat]])[0], projection([+item[userLong], +item.GCcleanPOBlat])[1]])
                mappableFull.push(item)
            }

        })

        setUnmapIndex(unmapIndex)

        return [userDataLen, unmapItems, absentCoordinates, unmapIndex, mappableLatsLongs, mappableFull, columns]

    }

    useEffect(() => {
        d3.csv(process.env.PUBLIC_URL + "anon_rosterm_id.csv").then(dataset => {
            const result = processDataset(dataset)
            setDatasetRes(result)
            getReducedDataset(result)
        })
    }, [])

    useEffect(() => {
        d3.json(process.env.PUBLIC_URL + "world_1914.json").then(dataset => {
            setUserMap(dataset)
        })

    }, [])


    return (datasetRes !== null && userMap !== null && reducedData !== null) ? (
        <>
            <Container text>
                <Header size='small'>1. Upload data and basemap</Header>
                <Button icon='upload' content='Upload dataset (csv)' />
                <input type='file' hidden />
                <Button.Group>
                    <Button>Load default basemap</Button>
                    <Button.Or />
                    <Button>Upload your own</Button>
                </Button.Group>
                <Divider></Divider>
                <Header size='small'>2. Select latitude and longitude</Header>
                <Message>To enable map display, indicate which columns of your dataset describe latitude and longitude.</Message>
                <Form size='mini'>
                    <Form.Group widths='equal'>
                        <Form.Field
                            control={Select}
                            label='Latitude'
                            placeholder='Latitude'
                        />
                        <Form.Field
                            control={Select}
                            label='Longitude'
                            placeholder='Longitude'
                        />
                    </Form.Group>
                    <Form.Button size='small'>Update</Form.Button>
                </Form>

                <Divider></Divider>
                <GeoMappableStats stats={[datasetRes[2].length, datasetRes[1].length, datasetRes[5].length, datasetRes[0]]} />

                <Header size='small'>3. Visually explore your dataset</Header>


            </Container>
            <Divider hidden />

            <GeoExplMap userMap={userMap} data={datasetRes} reducedData={[reducedData, reducedDataLatsLongs]} />

        </>

    ) : (<Container>
        <Dimmer active inverted>
            <Loader size='medium' inverted content='Loading' />
        </Dimmer>
    </Container>)

}

export default GeoDataLoad
