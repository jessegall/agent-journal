<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ExplainCommandPayload;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\CommandRules\Enums\RequestHoldReason;
use App\Models\CommandRules\CommandRequest;
use App\Processes\Data\ExplanationData;
use App\Processes\Data\HeldPartData;
use App\Processes\Explanations;

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
    #[Dispatches(OpenCommandRequestCommand::class)]
    public function __invoke(ExplainCommandPayload $call, CommandBus $commands): ExplanationData
    {
        $explanation = $this->explanations->explain($call->line, $call->dialect);

        if ($explanation->held === []) {
            return $explanation;
        }

        $held = array_map(fn (HeldPartData $part) => $this->withRequest($part, $call, $commands), $explanation->held);

        return ExplanationData::from([...$explanation->toArray(), 'held' => $held, 'notice' => self::NOTICE]);
    }

    private function withRequest(HeldPartData $part, ExplainCommandPayload $call, CommandBus $commands): HeldPartData
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
