<?php

declare(strict_types=1);

namespace Domain\Helpers\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Support\CallKey;
use App\Values\CommandReport;
use Domain\Helpers\Calls\ContinueHelperCall;
use Domain\Helpers\Calls\HelperCalls;
use Domain\Helpers\Console\Concerns\PrintsHelperReceipts;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class HelperContinueCommand extends Command
{
    use PrintsHelperReceipts;
    use RunsCallPipelines;

    protected $signature = 'helper:continue {identity} {--job= : The unfinished job} {--model= : The model, or default} {--driver= : The driver, when the profile allows several} {--key= : The request key, to retry the same request} {--json : Print the receipt as JSON}';

    protected $description = 'Continue the unfinished job of a helper';

    public function handle(HelperCalls $helpers): int
    {
        $model = $this->namedModel();

        if ($model === null) {
            $this->error(self::MODEL_REQUIRED);

            return self::FAILURE;
        }

        $call = ContinueHelperCall::from([
            'identityId' => (string) $this->argument('identity'),
            'jobId' => (string) $this->option('job'),
            'model' => $model,
            'driverKey' => $this->textOption('driver'),
            'requestKey' => CallKey::fromOption($this->textOption('key')),
        ]);

        if ($this->option('json') === true) {
            return $this->runCall($call);
        }

        return $this->runReport(fn (): CommandReport => $this->receiptReport($helpers->continueHelper(
            $call->identityId,
            $call->jobId,
            $call->model,
            $call->driverKey,
            $call->requestKey,
        )));
    }
}
