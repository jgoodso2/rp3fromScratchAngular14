
import * as moment from 'moment'

export class CurrentCalendarYear {
    constructor(public startDate = moment().startOf('year').toDate()
        , public endDate = moment().endOf('year').toDate()) {
    }
}

export class CurrentFiscalYear {
    constructor(public startDate = moment().startOf('year').toDate()
        , public endDate = moment().endOf('year').add(20,'days').toDate()) {
    }
}

export class Next12Months {
    constructor(public startDate = moment().startOf('month').toDate()
        , public endDate = moment().endOf('month').add(12,'month').toDate()) {
    }
}

export class NextYear {
    constructor(public startDate = moment().startOf('year').add(1,'year').toDate()
        , public endDate = moment().endOf('year').add(1,'year').toDate()) {
    }
}
export class LastYear {
    constructor(public startDate = moment().startOf('year').add(-1,'year').toDate()
        , public endDate = moment().endOf('year').add(-1,'year').toDate()) {
    }
}



