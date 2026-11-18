<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Contracts\CommandHandler;
use App\Processes\Commands\AssessPartOutput;
use App\Processes\Contracts\ResultPublisher;
use App\Processes\Events\EvidenceInvalid;
use App\Processes\Models\OutputAssessment;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\ReaderRevision;
use App\Processes\Support\ActiveRules;
use App\Processes\Support\EvidenceValidator;
use App\Processes\Support\ReaderReplay;
use App\Processes\Values\OutputProblem;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Stores a new assessment of the part, linked to the one it replaces, and publishes a receipt only from a valid one;
 * a part whose operation has no approved check with a proven reader is left awaiting its reader.
 */
final readonly class AssessPartOutputHandler implements CommandHandler
{
    public function __construct(
        private ActiveRules $rules,
        private ReaderReplay $replays,
        private EvidenceValidator $validator,
        private ResultPublisher $publisher,
        private Dispatcher $events,
    ) {}

    public function handle(AssessPartOutput $command): string
    {
        $part = PartRun::query()->whereKey($command->partRunId)->lockForUpdate()->sole();
        $approved = $this->rules->approvedFor($part->operation);
        if ($approved === [] || $approved[0]->payload->contracts === [] || $approved[0]->reader_approvals === []) {
            return '';
        }
        $declaration = $approved[0];
        $contract = $declaration->payload->contracts[0];
        $reader = ReaderRevision::query()->findOrFail($declaration->reader_approvals[0]->readerRevisionId);
        $replayed = $this->replays->replay($reader, $contract, $part);
        $validation = $this->validator->validate($part, $replayed->assessment, $replayed->consumed, $contract);
        $run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($part->process_run_id);
        $assessment = OutputAssessment::record($run, $part, $declaration, $reader, $replayed, $validation);
        if (! $validation->isValid()) {
            $codes = array_map(fn (OutputProblem $problem): string => $problem->code->value, $validation->problems);
            $actor = [(string) $run->actor_type, (string) $run->actor_id];
            $this->events->dispatch(new EvidenceInvalid($assessment->id, $part->id, $actor[0], $actor[1], $codes));

            return '';
        }

        return $this->publisher->publish($this->validator->verify($assessment))->id;
    }
}
