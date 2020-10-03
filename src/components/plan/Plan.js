import React, { Component } from 'react';

class Plan extends Component{
    render(){
        return(
            <body>
                <h2>Conv_Trans Return Calculator</h2>
                <table width = "100%">
                    <tr>
                      <th></th>
                      <th>Fresh Machine</th>
                      <th>Fresh Hand</th> 
                      <th>Machine IQF</th> 
                    </tr>
                    <tr>
                      <th>FOB PER ROUND</th>
                      <td>$2.00</td>
                      <td>$2.00</td>
                      <td>$0.50</td> 
                    </tr>
                    <tr>
                        <th>BLENDED NET GROWER RETURN</th>
                        <td>$0.16</td>
                        <td>$0.04</td>
                        <td>$0.16</td>
                    </tr>
                </table>
                <br></br>
                <table width = "100%">
                    <tr><th> PACKOUT RATES</th></tr>
                    <tr>
                        <td>Fresh Packout</td>
                        <td> 50.00 %</td>
                        <td> 80.00 %</td>
                    </tr>
                    <tr>
                        <td>% IQF</td>
                        <td>20%</td>
                        <td>10%</td>
                        <td>70%</td>
                    </tr>
                    <tr>
                        <td>% Juice Fresh / N Grade IQF</td>
                        <td>10%</td>
                        <td>0%</td>
                        <td>10%</td>
                    </tr>
                </table>
            </body>
        );
    }
}

export default Plan;