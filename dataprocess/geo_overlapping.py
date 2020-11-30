import pandas as pd

def geo_overlapping_merge(file_name,exceptions):
   
    file = 'public/{}.csv'.format(file_name)
    df = pd.read_csv(file)

    df2 = df.drop(exceptions)
    
    # to be continued
    # (test to see that it works)
    print(len(df))
    print(len(df2))
    print(df2)
   