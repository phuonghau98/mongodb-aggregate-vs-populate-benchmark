import matplotlib.pyplot as plt
import json
import numpy as np
from sklearn.linear_model import LinearRegression

lookup_takens = []
populate_takens = []

with open('lookup_data.json') as json_file:
    lookup_takens = json.load(json_file)['data']

with open('populate_data.json') as json_file:
    populate_takens = json.load(json_file)['data']

x = np.arange(0, len(lookup_takens)).reshape((-1, 1))
y1 = np.array(lookup_takens)
y2 = np.array(populate_takens)

# Regression
model1 = LinearRegression().fit(x, y1)
model2 = LinearRegression().fit(x, y2)
intercept1 = model1.intercept_
coef1 = model1.coef_
intercept2 = model2.intercept_
coef2 = model2.coef_



y1_tunned = x * coef1 + intercept1
y2_tunned = x * coef2 + intercept2
# print(x.shape)
# print(y1.shape)
plt.plot(x, y1_tunned, label='$lookup')
plt.plot(x, y2_tunned, label='.populate()')
plt.xlabel('N of conferences selected')
plt.ylabel('Time taken (ms)')
plt.legend()
plt.show()
