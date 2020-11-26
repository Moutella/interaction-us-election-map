import pandas as pd
import numpy as np

lista = {"state","timestamp","leading_candidate_name","trailing_candidate_name","leading_candidate_votes","trailing_candidate_votes"}

df = pd.read_csv("all-state-changes.csv", usecols=lista)

df['trump_votes'] = np.where(df['trailing_candidate_name'] == 'Trump', df['trailing_candidate_votes'], df['leading_candidate_votes'])
df['biden_votes'] = np.where(df['trailing_candidate_name'] == 'Trump', df['leading_candidate_votes'], df['trailing_candidate_votes'])
df['trump_percentage'] = df['trump_votes'] / (df['trump_votes'] + df['biden_votes'])

df['state'] = df['state'].str.replace(r"(\s*\(.*?\)\s*)", " ").str.strip()

df.drop(columns = ['trailing_candidate_name', 'leading_candidate_name', 'trailing_candidate_votes', 'leading_candidate_votes'], inplace=True)
df.to_json("election-filtered.json", orient="records")
