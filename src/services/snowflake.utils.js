module.exports.snowflake = (d) => {
    let date = new Date();
    let unique = ((Math.random() *1000) +"").slice(-4)

    date = date.toISOString().replace(/[^0-9]/g, "").replace(date.getFullYear(),unique);
    if(d==date)
        date = UniqueValue(date);
    return date;
}