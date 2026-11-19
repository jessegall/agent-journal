<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\Models\HookCall;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Storage\RecordedSteps;
use App\Hooks\Values\Answer\RenderedCall;
use App\Pipelines\Contracts\Pipe;

/**
 * Saves the stack as the answer left it, records the call with its reply and steps so a retry gets the same bytes,
 * links the two and hands the reply out.
 */
final readonly class SaveCall implements Pipe
{
    public function __construct(private StateTypes $types) {}

    public function handle(RenderedCall $rendered): ProgramReply
    {
        $answer = $rendered->answer;
        $rendered->row->saveFrames($answer->stack->records(), $this->types->ticking());
        $call = new HookCall();
        $call->recordFor(
            $rendered->call->identity,
            $rendered->reply->recordedAs($answer->decision->answerType()),
            RecordedSteps::of($answer->steps),
        );
        $rendered->row->linkTo($call);

        return $rendered->reply;
    }
}
