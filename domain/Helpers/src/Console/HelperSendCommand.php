<?php

declare(strict_types=1);

namespace Domain\Helpers\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Helpers\Calls\HelperCalls;
use Domain\Helpers\Calls\SendHelperCall;
use Domain\Helpers\Console\Concerns\PrintsHelperReceipts;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class HelperSendCommand extends Command
{
    use PrintsHelperReceipts;
    use RunsCallPipelines;

    protected $signature = 'helper:send {identity} {brief} {--profile= : The profile of the helper} {--subject= : The record the work is about, as type:id} {--purpose= : An existing purpose id} {--purpose-text= : A purpose in words} {--source=* : Records given as the source, as type:id} {--independent : Independent of everything the helper saw} {--program= : The program, when the profile allows several} {--model= : The model, or default} {--key= : The request key, to retry the same request} {--json : Print the receipt as JSON}';

    protected $description = 'Give the named helper new work';

    public function handle(HelperCalls $helpers): int
    {
        $model = $this->namedModel();

        if ($model === null) {
            $this->error(self::MODEL_REQUIRED);

            return self::FAILURE;
        }

        $call = SendHelperCall::from([
            'identityId' => (string) $this->argument('identity'),
            'profileKey' => (string) $this->option('profile'),
            'model' => $model,
            'programKey' => $this->textOption('program'),
            'subject' => $this->textOption('subject'),
            'purposeId' => $this->textOption('purpose'),
            'purposeText' => $this->textOption('purpose-text'),
            'brief' => (string) $this->argument('brief'),
            'sourceSubjects' => array_values(array_map(strval(...), (array) $this->option('source'))),
            'independent' => $this->option('independent') === true,
            'requestKey' => CallKey::fromOption($this->textOption('key')),
        ]);

        if ($this->option('json') === true) {
            return $this->runCall($call);
        }

        return $this->runReport(fn (): CommandReport => $this->receiptReport($helpers->sendHelper(
            $call->identityId,
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
