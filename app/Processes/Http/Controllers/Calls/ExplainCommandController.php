<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ExplainCommandCall;
use App\Processes\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\Processes\Data\ExplanationData;
use App\Processes\Data\HeldPartData;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Models\CommandRequest;
use App\Processes\Support\Explanations;

/**
 * Explains a line, opening a request for each part it holds.
 */
final readonly class ExplainCommandController
{
    private const string NOTICE = 'Nothing in this request started.';

    public function __construct(private Explanations $explanations) {}

    /**
     * Answers even when a held part opens its request: an explanation reads the line and starts nothing.
     */
    public function __invoke(ExplainCommandCall $call, CommandBus $commands): ExplanationData
    {
        $explanation = $this->explanations->explain($call->line, $call->dialect);

        if ($explanation->held === []) {
            return $explanation;
        }

        $held = array_map(fn (HeldPartData $part) => $this->withRequest($part, $call, $commands), $explanation->held);

        return ExplanationData::from([...$explanation->toArray(), 'held' => $held, 'notice' => self::NOTICE]);
    }

    private function withRequest(HeldPartData $part, ExplainCommandCall $call, CommandBus $commands): HeldPartData
    {
        $requestId = $commands->run(new OpenCommandRequestCommand(
            $part->operation,
            hash('sha256', $part->operation),
            $call->line,
            base_path(),
            RequestHoldReason::from($part->holdReason),
        ));

        $opened = CommandRequest::query()->findOrFail($requestId);

        return $part->heldIn($opened);
    }
}
