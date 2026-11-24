package drivers

import "journal-agent/drivers/contracts"

// journalLimits are the waits the journal sends by default, as App\Values\DriverLimits holds them.
var journalLimits = contracts.Limits{
	ReadyWaitMs: 10000, EchoWaitMs: 5000, UnsentLookMs: 2000, UnsentEnters: 3, TurnStartWindowMs: 10000,
	StrandedSettleMs: 5000, StopGraceMs: 5000, StopForceMs: 2000,
}
