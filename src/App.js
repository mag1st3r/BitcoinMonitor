import React from 'react';

import './App.css';

class App extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    rate: null,
    prevRate: null
  }

    changeState =  (res) => {
      const result = res.bpi;
      const prevResult = this.state.prevRate ? this.state.prevRate : result ;
      this.setState({
          rate: {
              ...result
          },
          prevRate: {
              ...prevResult
          },

          isLoaded: true
      });



}

   async componentDidMount() {
        await  fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
            .then(res => res.json())
            .then(
                (result) => {
                    this.changeState(result);
                },
                
                (error) => {
                    this.setState({
                        isLoaded: false,
                        error
                    });
                }
            )
    }

    async refresh ()  {
        await  fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
            .then(res => res.json())
            .then(
                (result) => {
                    this.changeState(result);
                });
    }


    render () {
    if(!this.state.isLoaded){
      return <div>
        is Loading....
      </div>
    }
        const {rate, prevRate} = this.state;

        const list = Object.keys(rate).map ( (item) => {
            return rate[item];
        });

         const prevList = Object.keys(prevRate).map ( (item) => {
             return prevRate[item];
         });

          const delta = Object.keys(prevRate).map( (item, id) => {
            return prevRate[item].rate_float - list[id].rate_float
          });




      return (
        <div className="App">
          <div>
            <h2>Previous</h2>
              {prevList.map( (item) =>
                <Item
                    symbol={item.symbol}
                    rate={item.rate_float}
                />
              )}
          </div>
          <div>
            <h2>Current</h2>
              {list.map( (item) =>
                  <Item
                      rate={item.rate_float}
                  />
              )}
          </div>
          <div>
            <h2>DELTA</h2>
              {delta.map( (item) =>
                  <Item
                      rate={item}
                  />
              )}
          </div>
          <button

              onClick={ () => {this.refresh()} }
          >
            Refresh
          </button>
        </div>
      );
    }
  }


function Item({symbol, rate}) {
    return (
        <div>
            <span
                dangerouslySetInnerHTML={{__html: symbol }}
            >

            </span>
            {" "}
            {rate}
        </div>
    )
}

export default App;
