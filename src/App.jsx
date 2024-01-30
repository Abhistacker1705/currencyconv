import {useState, useEffect} from 'react';

function App() {
  const [inputAmt, setInputAmt] = useState(null);
  const [convAmt, setConvAmt] = useState(null);
  const [srcCurr, setSrcCurr] = useState('');
  const [targetCurr, setTargetCurr] = useState('');
  const [eurbyusd, setEurbyusd] = useState(1.05);
  const [usdbyinr, setUsdbyinr] = useState(80.05);
  const [audbyusd, setAudbyusd] = useState(0.67);
  const [conversionHistory, setConversionHistory] = useState([]);
  //conv fn

  const getConversionRate = (srcCurr, targetCurr) => {
    const conversionRates = {
      euro: {usd: eurbyusd},
      usd: {inr: usdbyinr},
      aud: {usd: audbyusd},
    };

    return conversionRates[srcCurr]?.[targetCurr];
  };

  const handleExchangeClick = () => {
    if (srcCurr && targetCurr && inputAmt && convAmt) {
      setConversionHistory((prevHistory) => [
        ...prevHistory,
        {
          source: srcCurr,
          target: targetCurr,
          amount: inputAmt,
          convertedAmount: convAmt,
        },
      ]);
    } else return;
  };

  useEffect(() => {
    if (srcCurr && targetCurr) {
      // get conversion rate
      const conversionRate = getConversionRate(srcCurr, targetCurr);

      if (conversionRate) {
        const converted = inputAmt * conversionRate;
        setConvAmt(converted.toFixed(2));
      } else {
        setConvAmt(null);
      }
    } else {
      setConvAmt(null);
    }
  }, [srcCurr, targetCurr, inputAmt, audbyusd, usdbyinr, eurbyusd]);

  const handleFluctuation = () => {
    const percChnage = Math.floor(Math.random() * 2);

    const perc = [1.03, 0.97];
    setAudbyusd((prev) => (prev * perc[percChnage]).toFixed(2));
    setEurbyusd((prev) => (prev * perc[percChnage]).toFixed(2));
    setUsdbyinr((prev) => (prev * perc[percChnage]).toFixed(2));
  };

  useEffect(() => {
    const interval = setInterval(handleFluctuation, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 min-h-screen bg-[#D9D9D9] max-lg:flex flex-col gap-8">
        <section className="flex justify-center items-center h-full">
          <div className="flex flex-col gap-5 bg-[#0A0634] px-9 py-10 text-white h-4/5 w-3/5 rounded-lg">
            <h2 className="text-2xl font-bold">Markets</h2>
            <div className="flex flex-col bg-[#D9D9D9] text-[#505050]">
              <div className="flex">
                <div className="border py-2 border-[#828282] w-[80%]">
                  EUR/USD
                </div>
                <div className="border py-2 border-[#828282] w-[20%]">
                  {eurbyusd}
                </div>
              </div>
              <div className="flex">
                <div className="border py-2 border-[#828282] w-[80%]">
                  USD/INR
                </div>
                <div className="border py-2 border-[#828282] w-[20%]">
                  {usdbyinr}
                </div>
              </div>
              <div className="flex">
                <div className="border py-2 border-[#828282] w-[80%]">
                  AUD/USD
                </div>
                <div className="border py-2 border-[#828282] w-[20%]">
                  {audbyusd}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="flex justify-center items-center h-full">
          <div className="flex justify-center items-center flex-col gap-5 bg-[#CCCCCC] px-9 py-10 h-4/5 w-3/5 rounded-lg">
            <h2 className="text-2xl font-bold">Currency Convertor</h2>
            <div className="flex flex-col gap-4">
              <div>
                <p>Source Currency</p>
                <select
                  className="bg-[#D9D9D9]"
                  value={srcCurr}
                  onChange={(e) => setSrcCurr(e.target.value)}>
                  <option value="">Select a source currency</option>
                  <option value="euro">EUR</option>
                  <option value={'usd'}>USD</option>
                  <option value={'aud'}>AUD</option>
                </select>
              </div>

              {/* target currency  */}
              <div>
                <p>Target Currency</p>
                <select
                  className="bg-[#D9D9D9]"
                  onChange={(e) => setTargetCurr(e.target.value)}
                  value={targetCurr}>
                  <option value="">Select a target currency</option>
                  <option
                    disabled={srcCurr != 'aud' && srcCurr != 'euro'}
                    value="usd">
                    USD
                  </option>
                  <option disabled={srcCurr !== 'usd'} value={'inr'}>
                    INR
                  </option>
                </select>
              </div>
              <div>
                <p>Amount</p>
                <input
                  className="bg-[#D9D9D9]"
                  type="number"
                  onChange={(e) => setInputAmt(e.target.value)}
                  value={inputAmt}
                  inputMode="numeric"
                />
              </div>

              <div className="bg-[#D9D9D9] w-full p-4">{`Estimated Converted Amount : ${convAmt} `}</div>
            </div>
            <button
              onClick={handleExchangeClick}
              className="bg-[#D9D9D9] rounded-lg p-2 font-bold">
              Exchange
            </button>
          </div>
        </section>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">History</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Converted Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {conversionHistory.map((entry, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{entry.source}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.target}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.convertedAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
