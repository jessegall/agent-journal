<?php

declare(strict_types=1);

namespace Domain\Helpers\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Helpers\Calls\HelperCalls;
use Domain\Helpers\Calls\StartHelperCall;
use Domain\Helpers\Console\Concerns\PrintsHelperReceipts;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class HelperStartCommand extends Command
{
    use PrintsHelperReceipts;
    use RunsCallPipelines;

    protected $signature = 'helper:start {profile} {--brief= : The work} {--subject= : The record the work is about, as type:id} {--purpose= : An existing purpose id} {--purpose-text= : A purpose in words} {--source=* : Records given as the source, as type:id} {--independent : Independent of everything the helper saw} {--program= : The program, when the profile allows several} {--model= : The model, or default} {--key= : The request key, to retry the same request} {--json : Print the receipt as JSON}';

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
            'programKey' => $this->textOption('program'),
            'subject' => $this->textOption('subject'),
            'purposeId' => $this->textOption('purpose'),
            'purposeText' => $this->textOption('purpose-text'),
            'brief' => (string) $this->option('brief'),
            'sourceSubjects' => array_values(array_map(strval(...), (array) $this->option('source'))),
            'independent' => $this->option('independent') === true,
            'requestKey' => CallKey::fromOption($this->textOption('key')),
        ]);

        if ($this->option('json') === true) {
            return $this->runCall($call);
        }

        return $this->runReport(fn (): CommandReport => $this->receiptReport($helpers->startHelper(
            $call->profileKey,
            $call->model,
            $call->programKey,
            $call->subject,
            $call->purposeId,
            $call->purposeText,
            $call->brief,
            $call->requestKey,
            $call->sourceSubjects,
            $call->independent,
        )));
    }
}
