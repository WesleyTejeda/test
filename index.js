let start = async () => {
    let transactionLogs = [];
    let req = {};
    req.body = {
        type: "sell",
        quantity: 3,
        id: [10, 11, 12, 13, 14],
        fundKey: 19,
        quantityArr: [2, 7, 3]
    }
    let quantityToSell = req.body.quantity;
    console.log(quantityToSell, "to sell")
    let quantitySold = 0;
    for(let i = 0; i < req.body.id.length; i++){
        let quantity = 0;
        if(quantitySold === req.body.quantity){
            console.log("--------HIT break ------------- ")
            continue
        }
        if(quantityToSell >= req.body.quantityArr[i]){
            console.log("--------HIT >= ------------- ")
            quantity = req.body.quantityArr[i];
        } else {
            console.log("--------HIT else ------------- ")
            quantity = quantityToSell;
        }
        let temp = await fetchData({
            body: {
                type: "sell",
                id: req.body.id[i],
                quantity: quantity
            }
        })
        quantitySold += temp.quantity;
        quantityToSell -= temp.quantity;
        console.log("quantites------------", quantitySold, quantityToSell)
        transactionLogs.push(temp);
    }
    console.log('LOGGING TRANSACTIONS:');
    console.log(transactionLogs) 
}

const fetchData = req => {
    let db = [];
    let obj1 = {};
    obj1.dataValues = {
        CustomerId: "61fc51db1becb4ac11f05a33",
        amount: 2949.73,
        createdAt: "2022-02-04T16:15:03.643Z",
        fund_id: 1,
        id: 10,
        itemDescription: "500 Index  Admiral Shares",
        pricePerUnit: 421.39,
        quantity: 7,
        quantityAvailable: 7,
        sold: false,
        type: "purchase",
        updatedAt: "2022-02-04T21:06:00.558Z"
    }
    let obj2 = {};
    obj2.dataValues = {
        CustomerId: "61fc51db1becb4ac11f05a33",
        amount: 2949.73,
        createdAt: "2022-02-04T16:15:03.643Z",
        fund_id: 1,
        id: 11,
        itemDescription: "500 Index  Admiral Shares",
        pricePerUnit: 421.39,
        quantity: 7,
        quantityAvailable: 7,
        sold: false,
        type: "purchase",
        updatedAt: "2022-02-04T21:06:00.558Z"
    }
    let obj3 = {};
    obj3.dataValues = {
        CustomerId: "61fc51db1becb4ac11f05a33",
        amount: 2949.73,
        createdAt: "2022-02-04T16:15:03.643Z",
        fund_id: 1,
        id: 12,
        itemDescription: "500 Index  Admiral Shares",
        pricePerUnit: 421.39,
        quantity: 7,
        quantityAvailable: 2,
        sold: false,
        type: "purchase",
        updatedAt: "2022-02-04T21:06:00.558Z"
    }
    let obj4 = {};
    obj4.dataValues = {
        CustomerId: "61fc51db1becb4ac11f05a33",
        amount: 2949.73,
        createdAt: "2022-02-04T16:15:03.643Z",
        fund_id: 1,
        id: 13,
        itemDescription: "500 Index  Admiral Shares",
        pricePerUnit: 421.39,
        quantity: 7,
        quantityAvailable: 3,
        sold: false,
        type: "purchase",
        updatedAt: "2022-02-04T21:06:00.558Z"
    }
    let obj5 = {};
    obj5.dataValues = {
        CustomerId: "61fc51db1becb4ac11f05a33",
        amount: 2949.73,
        createdAt: "2022-02-04T16:15:03.643Z",
        fund_id: 1,
        id: 14,
        itemDescription: "500 Index  Admiral Shares",
        pricePerUnit: 421.39,
        quantity: 7,
        quantityAvailable: 4,
        sold: false,
        type: "purchase",
        updatedAt: "2022-02-04T21:06:00.558Z"
    }
    db.push(obj1);
    db.push(obj2);
    db.push(obj3);
    db.push(obj4);
    db.push(obj5);
    // console.log("------------------- DB -------------", db)
    return new Promise(resolve => {
        // console.log(req)
        setTimeout(() => {
            let amount = 0;
            let newQuantity = 0;
            let message = {note: ""};
            let transactionToSell = db.find(entry => entry.dataValues.id === req.body.id)
            console.log("------------ QUANTITY REQUESTED --------", req.body.quantity,"------------ QUANTITY IN ACCOUNT --------", transactionToSell.dataValues.quantityAvailable)

            if(req.body.quantity > transactionToSell.dataValues.quantityAvailable){
                req.body.quantity = transactionToSell.dataValues.quantityAvailable;
                message.note = `You have ${transactionToSell.dataValues.quantityAvailable} shares available to sell which is less than quantity provided for this fund. We've adjusted the quantity to sell the remaining shares.`
                // resolve({error: `You have ${transactionToSell.dataValues.quantityAvailable} shares available to sell which is less than quantity provided. Please enter correct quantity`});
            }
            if(transactionToSell.dataValues.quantityAvailable <= 0){
                resolve({error: "You already sold all shares of "+transactionToSell.itemDescription})
            }
            if(req.body.quantity <= transactionToSell.dataValues.quantity){
                amount = req.body.quantity * transactionToSell.dataValues.pricePerUnit;
                newQuantity = transactionToSell.dataValues.quantityAvailable - req.body.quantity;
            } else {
                amount = transactionToSell.dataValues.quantity * transactionToSell.dataValues.pricePerUnit;
                newQuantity = 0;
            }
            console.log(newQuantity,"NEW------------ PASSED")
            
            // if(newQuantity > 0){
            //     await Transaction.update({
            //         quantityAvailable: newQuantity
            //     }, {
            //         where: {
            //             id: transactionToSell.dataValues.id
            //         }
            //     })
            // } else if(newQuantity === 0) {
            //     await Transaction.update({
            //         sold: true,
            //         quantityAvailable: 0
            //     }, {
            //         where: {
            //             id: transactionToSell.dataValues.id
            //         }
            //     })
            // }
            console.log("------------ PASSED")
            let rtnObj = {
                type: "sell",
                quantity: transactionToSell.dataValues.quantityAvailable - newQuantity,
                quantityLeft: newQuantity,
                amount: amount
            }
            if(message.note){
                rtnObj.note = message.note;
            }
            resolve(rtnObj)
        }, 1000);
    })
}

start()