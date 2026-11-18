<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ExplainCommandRequest;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Data\ExplanationData;
use App\Processes\Data\HeldPartData;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Models\CommandRequest;
use App\Processes\Support\Explanations;

/**
 * Explains how a line is read without running it; each part the journal will not run yet gets the command request
 * that holds it, with its state and the exact next allowed command.
 */
final readonly class ExplainCommandController
{
    private const string NOTICE = 'Nothing in this request started.';

    public function __construct(private Explanations $explanations) {}

    public function __invoke(ExplainCommandRequest $request, CommandBus $commands): ExplanationData
    {
        $explanation = $this->explanations->explain($request->line(), $request->dialect());
        if ($explanation->held === []) {
            return $explanation;
        }
        $held = array_map(
            fn (HeldPartData $part): HeldPartData => $this->withRequest($part, $request, $commands),
            $explanation->held,
        );

        return ExplanationData::from([...$explanation->toArray(), 'held' => $held, 'notice' => self::NOTICE]);
    }

    private function withRequest(HeldPartData $part, ExplainCommandRequest $request, CommandBus $commands): HeldPartData
    {
        $requestId = $commands->run(new OpenCommandRequest(
            $part->operation,
            hash('sha256', $part->operation),
            $request->line(),
            base_path(),
            RequestHoldReason::from($part->holdReason),
        ));
        $opened = CommandRequest::query()->findOrFail($requestId);

        return new HeldPartData(
            $part->node,
            $part->code,
            $part->operation,
            $part->holdReason,
            $opened->id,
            $opened->state->value,
            $opened->nextStep()->command,
        );
    }
}
