// noinspection BadExpressionStatementJS

{
  "intervals": [ // a collection of sleep sessions (or intervals)
    {
      "id": "1488258600", // id of the interval
      "ts": "2017-02-28T05:10:00.000Z", // time the session starts in ISO 8601 format
      "stages": [ // the sleep stages of the session
        {
          "stage": "awake", // each stage can be any of "awake" (in bed, awake), "out" (out of bed), "light" (in light sleep), "deep" (in deep sleep)
          "duration": 1024 // duration of the stage, in seconds
        },
        {
          "stage": "light",
          "duration": 1020
        }
      ],
      "score": 93, // the sleep score of the session (min 0, max 100)
      "timeseries": { // collection of timeseries data
        "tnt": [ // short for "toss and turns"
          ["2017-02-28T06:20:00.000Z", 1], // datapoint of the timeseries, in the format [time, value]
          ["2017-02-28T06:21:00.000Z", 2],
          ["2017-02-28T06:30:00.000Z", 1]
        ],
        "tempRoomC": [ // ambient room temperature, in celsius
          ["2017-02-28T05:00:00.000Z", 19.787400000000005],
        ],
        "tempBedC": [ // bed temperature, celsius
          ["2017-02-28T05:00:00.000Z", 34.151399999999995]
        ],
        "respiratoryRate": [ // measured in "breaths per minute"
          ["2017-02-28T05:00:00.000Z", 16.666666666666668],
        ],
        "heartRate": [ // measured in "beats per minute"
          ["2017-02-28T05:00:00.000Z", 48],
        ],
        "heating": [ // ignore this
          ["2017-02-28T05:10:00.000Z", 18840],
          ["2017-02-28T10:25:00.000Z", 11100]
        ]
      }
    },
    {
      // next interval
    }
  ]
}