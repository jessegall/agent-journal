<?php

declare(strict_types=1);

namespace Domain\Helpers\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Enums\Drivers\DriverType;
use App\Support\CallKey;
use Domain\Helpers\Calls\HelperCalls;
use Domain\Helpers\Calls\StartHelperCall;
use Domain\Helpers\Console\Concerns\PrintsHelperReceipts;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class HelperStartCommand extends Command
{
    use PrintsHelperReceipts;
    use RunsCallPipelines;

    protected $signature = 'helper:start {profile} {--brief= : The work} {--subject= : The record the work is about, as type:id} {--purpose= : An existing purpose id} {--purpose-text= : A purpose in words} {--source=* : Records given as the source, as type:id} {--independent : Independent of everything the helper saw} {--driver= : The driver, when the profile allows several} {--headless : Run it headless} {--no-headless : Run it in a terminal} {--model= : The model, or default} {--key= : The request key, to retry the same request} {--json : Print the receipt as JSON}';

    protected $description = 'Start a helper for work';

    public function handle(HelperCalls $helpers): int
    {
        $model = $this->namedModel();

        if ($model === null) {
            $this->error(self::MODEL_REQUIRED);

            return self::FAILURE;
        }

        $call = StartHelperCall::from([
            'profileKey' => (string) $this->argument('profile'),
            'model' => $model,
            'driverKey' => $this->textOption('driver'),
            'subject' => $this->textOption('subject'),
            'purposeId' => $this->textOption('purpose'),
            'purposeText' => $this->textOption('purpose-text'),
            'brief' => (string) $this->option('brief'),
            'sourceSubjects' => array_values(array_map(strval(...), (array) $this->option('source'))),
            'isIndependent' => $this->option('independent') === true,
            'requestKey' => CallKey::fromOption($this->textOption('key')),
            'driverType' => $this->namedDriverType(),
        ]);

        if ($this->option('json') === true) {
            return $this->runCall($call);
        }

        return $this->runReport(fn () => $this->receiptReport($helpers->startHelper(
            $call->profileKey,
            $call->model,
            $call->driverKey,
            $call->subject,
            $call->purposeId,
            $call->purposeText,
            $call->brief,
            $call->requestKey,
            $call->sourceSubjects,
            $call->isIndependent,
            $call->driverType,
        )));
    }

    /**
     * The driver type the flags name: headless, a terminal, or none to take the helper's saved driver type or its profile's.
     */
    private function namedDriverType(): DriverType|null
    {
        if ($this->option('headless') !== true && $this->option('no-headless') !== true) {
            return null;
        }

        return DriverType::ofHeadless($this->option('headless') === true);
    }
}
