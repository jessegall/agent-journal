<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Recordings\CallRecorders;
use App\Recordings\Enums\Wire;
use App\Recordings\RecordedCall;
use App\Recordings\RecordedEvent;
use App\Recordings\RecordingDrafts;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * The one tap on a wire of HTTP calls, as record.calls:<wire>: while recording is on, each call is kept as it was
 * asked and as it was answered, the answer passed on unchanged; while it is off, the call passes at once.
 */
final readonly class RecordCalls
{
    public function __construct(private RecordingDrafts $drafts, private CallRecorders $recorders) {}

    public function handle(Request $request, Closure $next, string $wire): Response
    {
        if (! $this->drafts->isOn()) {
            return $next($request);
        }

        $recorder = $this->recorders->of(Wire::from($wire));
        $exchange = $recorder->exchangeOf($request);
        $recorder->add($exchange, RecordedEvent::asked(RecordingDrafts::moment(), RecordedCall::askedBy($request)));

        $response = $next($request);
        $answer = RecordedCall::answeredWith($response, $request);
        $recorder->add($exchange, RecordedEvent::answered(RecordingDrafts::moment(), $answer));

        return $response;
    }
}
