<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Bus\Pipe;
use App\Models\Drivers\HookCall;
use App\Models\Records\Link;
use App\Support\CallStages\RenderedCall;
use App\Support\Drivers\DriverReply;
use App\Support\Stack\StateTypes;
use App\Support\Storage\RecordedSteps;

/**
 * Saves the stack as the answer left it, records the call with its reply and steps so a retry gets the same bytes,
 * links the two and hands the reply out.
 */
final readonly class SaveCall implements Pipe
{
    public function __construct(private StateTypes $types) {}

    public function handle(RenderedCall $rendered): DriverReply
    {
        $answer = $rendered->answer;
        $rendered->row->saveFrames($answer->stack->records(), $this->types->ticking());
        $call = new HookCall();

        $call->recordFor(
            $rendered->call->identity,
            $rendered->reply->recordedAs($answer->decision->answerType()),
            RecordedSteps::of($answer->steps),
        );

        Link::connect($rendered->row, $call);

        return $rendered->reply;
    }
}
