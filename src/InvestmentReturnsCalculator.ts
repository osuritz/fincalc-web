class PeriodReturn {
    startingAmount: number;
    periodContribution: number;
    totalContributions: number;
    interestEarned: number;
    totalInterestEarned: number;
    endBalance: number;
    
    constructor(startingAmount: number,
            periodContribution: number,
            totalContributions: number,
            interestEarned: number,
            totalInterestEarned: number,
            endBalance: number) {
        this.startingAmount = startingAmount;
        this.periodContribution = periodContribution;
        this.totalContributions = totalContributions;
        this.interestEarned = interestEarned;
        this.totalInterestEarned = totalInterestEarned;
        this.endBalance = endBalance;
    }    
}

class InvestmentReturnsCalculator {
    public static main(): number {
        console.log('Hello World');
        return 27;
    }

    /**
     * Computes the Future Value (FV) given a starting amount, regular contributions,
     * and an expected rate of return.
     * @param {number} presentValue The amount of money with which one starts (PV)
     * @param {number} regularContributions The amount of money added at each period (PMT)
     * @param {number} periods The number of periods during which to add the regularContributions (n)
     * @param {number} rate The expected rate of return per period (r)
     * @return {number} the future value (FV).
     */
    computeFutureValue(presentValue:number, regularContributions:number, periods:number, rate:number): number {
        let futureValue:number = presentValue;

        for (let i = 0; i < periods; i += 1) {
            futureValue = futureValue * (1 + rate) + regularContributions;
        }

        return Math.round(futureValue);
    }

    /**
     * Similar to computeFutureValue but instead of returning a single amount for the future value,
     * it returns a breakdown of the increase in value for each period.
     * @param {number} presentValue The amount of money with which one starts (PV)
     * @param {number} regularContributions The amount of money added at each period (PMT)
     * @param {number} period The number of period during which to add the regularContributions (n)
     * @param {number} rate The expected rate of return per period (r)
     * @return {Array<PeriodReturn>} the future value breakdown.
     */
    expandFutureValues(presentValue:number, regularContributions:number,
        periods:number, rate:number): Array<PeriodReturn> {
        let futureValue = presentValue;

        let futureValues: Array<PeriodReturn> = [];
        let totalContributions: number = 0;
        let totalInterestEarned = 0;
        for (let i = 0; i < periods; i += 1) {
            totalContributions += regularContributions;
            let interestEarned = futureValue * rate;
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
    }

    /**
     * Aggregates a breakdown of period future values to annual future values.
     * @param {Array<PeriodReturn>} periodValues Output provided by expandFutureValues
     * @param {number} periodsPerYear The number of periods per year
     * @return {Array<PeriodReturn>} annualized periods
     * @private
     */
    annualizePeriods_(periodValues: Array<PeriodReturn>, periodsPerYear: number): Array<PeriodReturn> {
        var annualizedValues = [];

        if (periodValues.length % periodsPerYear) {
            throw 'Unexpected number of periods: ' + periodValues.length;
        }

        for (let i = 0; i < periodValues.length; i += periodsPerYear) {
            let startingAmount: number = periodValues[i].startingAmount;
            let annualContributions: number = 0;
            let totalContributions: number = 0;
            let interestEarned: number = 0;
            let totalInterestEarned: number = 0;
            let endBalance: number = 0;
            for (let j = i; j < i+periodsPerYear; j += 1) {
                let currentPeriod: PeriodReturn = periodValues[j];
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
    }
    
    /**
     * Computes the Future Value (FV) given a starting amount, regular contributions,
     * and an expected annual rate of return.
     * @param {number} presentValue The amount of money with which one starts (PV)
     * @param {number} regularContributions The amount of money added at each period (PMT)
     * @param {number} period The number of period during which to add the regularContributions (n)
     * @param {number} rate The expected rate of return per period (r)
     * @return {number} the future value (FV).
     */
   computeFutureValuesOfContributions(startingAmount :number, amountPerPeriod :number,
        periodsPerYear: number, annualRate: number, numberOfYears: number): number {          
        return this.computeFutureValue(startingAmount, amountPerPeriod,
            periodsPerYear * numberOfYears, annualRate / periodsPerYear);
    }


     /**
     * Computes the Future Value (FV) given a starting amount, regular contributions,
     * and an expected annual rate of return.
     * @param {number} presentValue The amount of money with which one starts (PV)
     * @param {number} regularContributions The amount of money added at each period (PMT)
     * @param {number} period The number of period during which to add the regularContributions (n)
     * @param {number} rate The expected rate of return per period (r)
     * @return {Array<PeriodReturn>} the future values (FV).
     */
   computeAnnualizedFutureValuesOfContributions(startingAmount :number, amountPerPeriod :number,
        periodsPerYear: number, annualRate: number, numberOfYears: number): Array<PeriodReturn> {
        let futureValues: Array<PeriodReturn> = this.expandFutureValues(startingAmount, amountPerPeriod, periodsPerYear * numberOfYears, annualRate / periodsPerYear); 
        return this.annualizePeriods_(futureValues ,periodsPerYear);
    }
}