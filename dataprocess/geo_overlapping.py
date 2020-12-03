import pandas as pd
import csv
import random

def geo_overlapping_merge(file_name,exceptions):
    # exceptions contains id of rows that d3.js/front-end couldn't map or with empty lat and long
    file = 'public/{}.csv'.format(file_name)
    
    df = pd.read_csv(file)
    # remove unmappable rows
    user_df_selection = df.drop(exceptions)

    #this will need to be generalised, here = just a test
    reduced_dataset = user_df_selection.groupby(['GCcleanPOBlat','GCcleanPOBlon']).count().reset_index()

    reduced_dataset = reduced_dataset.drop(columns=['rawPOB', 'GCcleanPOBprec'])

    reduced_dataset = reduced_dataset.rename(columns={'ersatz_id': 'count'})

    reduced_dataset2 = user_df_selection.groupby(['GCcleanPOBlat','GCcleanPOBlon']).first().reset_index()

    dataset = pd.concat([reduced_dataset, reduced_dataset2], axis=1)

    dataset = reduced_dataset.merge(reduced_dataset2, left_on=['GCcleanPOBlat','GCcleanPOBlon'], right_on = ['GCcleanPOBlat','GCcleanPOBlon'], how='left')


    file_name = random.randint(1,10000)
    # path that will be used by front end
    exp_name = 'temp/{}.csv'.format(file_name)
    # path for storing the file
    path_name = 'public/temp/{}.csv'.format(file_name)
    
    dataset.to_csv(path_name)

    return [exp_name]
   