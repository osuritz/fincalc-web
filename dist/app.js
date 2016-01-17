var PeriodReturn = (function () {
    function PeriodReturn(startingAmount, periodContribution, totalContributions, interestEarned, totalInterestEarned, endBalance) {
        this.startingAmount = startingAmount;
        this.periodContribution = periodContribution;
        this.totalContributions = totalContributions;
        this.interestEarned = interestEarned;
        this.totalInterestEarned = totalInterestEarned;
        this.endBalance = endBalance;
    }
    return PeriodReturn;
})();
var InvestmentReturnsCalculator = (function () {
    function InvestmentReturnsCalculator() {
    }
    InvestmentReturnsCalculator.main = function () {
        console.log('Hello World');
        return 27;
    };
    /**
     * Computes the Future Value (FV) given a starting amount, regular contributions,
     * and an expected rate of return.
     * @param {number} presentValue The amount of money with which one starts (PV)
     * @param {number} regularContributions The amount of money added at each period (PMT)
     * @param {number} periods The number of periods during which to add the regularContributions (n)
     * @param {number} rate The expected rate of return per period (r)
     * @return {number} the future value (FV).
     */
    InvestmentReturnsCalculator.prototype.computeFutureValue = function (presentValue, regularContributions, periods, rate) {
        var futureValue = presentValue;
        for (var i = 0; i < periods; i += 1) {
            futureValue = futureValue * (1 + rate) + regularContributions;
        }
        return Math.round(futureValue);
    };
    /**
     * Similar to computeFutureValue but instead of returning a single amount for the future value,
     * it returns a breakdown of the increase in value for each period.
     * @param {number} presentValue The amount of money with which one starts (PV)
     * @param {number} regularContributions The amount of money added at each period (PMT)
     * @param {number} period The number of period during which to add the regularContributions (n)
     * @param {number} rate The expected rate of return per period (r)
     * @return {Array<PeriodReturn>} the future value breakdown.
     */
    InvestmentReturnsCalculator.prototype.expandFutureValues = function (presentValue, regularContributions, periods, rate) {
        var futureValue = presentValue;
        var futureValues = [];
        var totalContributions = 0;
        var totalInterestEarned = 0;
        for (var i = 0; i < periods; i += 1) {
            totalContributions += regularContributions;
            var interestEarned = futureValue * rate;
            totalInterestEarned += interestEarned;
            futureValue = futureValue + interestEarned + regularContributions;
            futureValues.push({
                startingAmount: presentValue,
                periodContribution: regularContributions,
                totalContributions: totalContributions,
                interestEarned: interestEarned,
                totalInterestEarned: totalInterestEarned,
                endBalance: Math.round(futureValue)
            });
        }
        return futureValues;
    };
    /**
     * Aggregates a breakdown of period future values to annual future values.
     * @param {Array<PeriodReturn>} periodValues Output provided by expandFutureValues
     * @param {number} periodsPerYear The number of periods per year
     * @return {Array<PeriodReturn>} annualized periods
     * @private
     */
    InvestmentReturnsCalculator.prototype.annualizePeriods_ = function (periodValues, periodsPerYear) {
        var annualizedValues = [];
        if (periodValues.length % periodsPerYear) {
            throw 'Unexpected number of periods: ' + periodValues.length;
        }
        for (var i = 0; i < periodValues.length; i += periodsPerYear) {
            var startingAmount = periodValues[i].startingAmount;
            var annualContributions = 0;
            var totalContributions = 0;
            var interestEarned = 0;
            var totalInterestEarned = 0;
            var endBalance = 0;
            for (var j = i; j < i + periodsPerYear; j += 1) {
                var currentPeriod = periodValues[j];
                annualContributions += currentPeriod.periodContribution;
                totalContributions = currentPeriod.totalContributions;
                interestEarned += currentPeriod.interestEarned;
                totalInterestEarned = currentPeriod.totalInterestEarned;
                endBalance = currentPeriod.endBalance;
            }
            annualizedValues.push({
                startingAmount: startingAmount,
                annualContribution: annualContributions,
                totalContributions: totalContributions,
                interestEarned: Math.round(interestEarned),
                totalInterestEarned: Math.round(totalInterestEarned),
                endBalance: endBalance
            });
        }
        return annualizedValues;
    };
    /**
     * Computes the Future Value (FV) given a starting amount, regular contributions,
     * and an expected annual rate of return.
     * @param {number} presentValue The amount of money with which one starts (PV)
     * @param {number} regularContributions The amount of money added at each period (PMT)
     * @param {number} period The number of period during which to add the regularContributions (n)
     * @param {number} rate The expected rate of return per period (r)
     * @return {number} the future value (FV).
     */
    InvestmentReturnsCalculator.prototype.computeFutureValuesOfContributions = function (startingAmount, amountPerPeriod, periodsPerYear, annualRate, numberOfYears) {
        return this.computeFutureValue(startingAmount, amountPerPeriod, periodsPerYear * numberOfYears, annualRate / periodsPerYear);
    };
    /**
    * Computes the Future Value (FV) given a starting amount, regular contributions,
    * and an expected annual rate of return.
    * @param {number} presentValue The amount of money with which one starts (PV)
    * @param {number} regularContributions The amount of money added at each period (PMT)
    * @param {number} period The number of period during which to add the regularContributions (n)
    * @param {number} rate The expected rate of return per period (r)
    * @return {Array<PeriodReturn>} the future values (FV).
    */
    InvestmentReturnsCalculator.prototype.computeAnnualizedFutureValuesOfContributions = function (startingAmount, amountPerPeriod, periodsPerYear, annualRate, numberOfYears) {
        var futureValues = this.expandFutureValues(startingAmount, amountPerPeriod, periodsPerYear * numberOfYears, annualRate / periodsPerYear);
        return this.annualizePeriods_(futureValues, periodsPerYear);
    };
    return InvestmentReturnsCalculator;
})();
//# sourceMappingURL=app.js.map