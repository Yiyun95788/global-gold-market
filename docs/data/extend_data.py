"""
Script to download data after 2022 for SP500, Gold, Bitcoin, and Oil
from Yahoo Finance and combine into the same format as the existing CSV.
"""

import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
import numpy as np

start_date = "2022-06-19"
end_date = "2025-12-31"

sp500 = yf.download("^GSPC", start=start_date, end=end_date, progress=False)
sp500 = sp500['Close'].reset_index()
sp500.columns = ['Date', 'S&P500']

gold = yf.download("GC=F", start=start_date, end=end_date, progress=False)
gold = gold['Close'].reset_index()
gold.columns = ['Date', 'Gold']

btc = yf.download("BTC-USD", start=start_date, end=end_date, progress=False)
btc = btc['Close'].reset_index()
btc.columns = ['Date', 'BITCOIN']

brent = yf.download("BZ=F", start=start_date, end=end_date, progress=False)
brent = brent['Close'].reset_index()
brent.columns = ['Date', 'Brent Oil']

wti = yf.download("CL=F", start=start_date, end=end_date, progress=False)
wti = wti['Close'].reset_index()
wti.columns = ['Date', 'Crude Oil WTI']

df = sp500.merge(gold, on='Date', how='outer')
df = df.merge(btc, on='Date', how='outer')
df = df.merge(brent, on='Date', how='outer')
df = df.merge(wti, on='Date', how='outer')

df = df.sort_values('Date')
df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
df = df.fillna(method='ffill')
df = df[['Date', 'BITCOIN', 'Brent Oil', 'Crude Oil WTI', 'Gold', 'S&P500']]

existing_df = pd.read_csv('w6_datasets/SP500 oil gold bitcoin.csv')
existing_df['Date'] = pd.to_datetime(existing_df['Date'])

last_existing_date = existing_df['Date'].max()
df['Date'] = pd.to_datetime(df['Date'])
new_data = df[df['Date'] > last_existing_date]

combined_df = pd.concat([existing_df, new_data], ignore_index=True)
combined_df = combined_df.sort_values('Date')
combined_df['Date'] = combined_df['Date'].dt.strftime('%Y-%m-%d')

output_file = 'SP500_oil_gold_bitcoin_extended.csv'
combined_df.to_csv(output_file, index=False)
