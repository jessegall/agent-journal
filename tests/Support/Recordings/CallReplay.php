<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\RecordedCall;
use App\Support\Recordings\ScenarioRecording;
use PHPUnit\Framework\Assert;
use Tests\Support\Recordings\Exceptions\LiveValueRefused;
use Tests\Support\Recordings\Exceptions\UnrecordedCall;

/**
 * The other side of a wire of calls, played from a recording, as the Go recorded.CallReplay: each call gets the
 * recorded answer of the first call not yet played with its method and path shape, its fakes bound to the live values
 * heard in their places; any other call fails naming it and the call the recording holds next.
 */
final class CallReplay
{
    /**
     * @var list<array{asked: RecordedCall|null, answered: RecordedCall}>
     */
    private array $calls = [];

    /**
     * @var list<bool>
     */
    private array $played = [];

    private RecordingValues $values;

    public function __construct(ScenarioRecording $recording, Wire $wire)
    {
        $waiting = [];

        foreach ($recording->calls($wire) as $call) {
            if ($call->status === null) {
                $waiting[] = $call;

                continue;
            }

            $this->calls[] = ['asked' => $this->takeAsking($waiting, $call), 'answered' => $call];
        }

        $this->played = array_fill(0, count($this->calls), false);
        $this->values = new RecordingValues();
    }

    /**
     * The recorded answer to the call, with the live values bound so far in place of its fakes.
     *
     * @throws UnrecordedCall
     */
    public function answer(string $method, string $path, string $body = ''): RecordedCall
    {
        $next = null;

        foreach ($this->calls as $index => $call) {
            if ($this->played[$index]) {
                continue;
            }

            $next ??= $call['answered'];
            $tried = clone $this->values;

            try {
                $this->hearCall($tried, $index, $method, $path, $body);
            } catch (LiveValueRefused) {
                continue;
            }

            $this->values = $tried;
            $this->played[$index] = true;

            return $call['answered']->withBody($this->values->live($call['answered']->body));
        }

        $asked = "{$method} {$path}";

        throw $next === null
            ? UnrecordedCall::afterEveryCall($asked)
            : UnrecordedCall::asked($asked, "{$next->method} {$next->path}");
    }

    public function assertPlayedWhole(): void
    {
        $left = [];

        foreach ($this->calls as $index => $call) {
            if (! $this->played[$index]) {
                $left[] = "{$call['answered']->method} {$call['answered']->path}";
            }
        }

        Assert::assertSame([], $left, 'These recorded calls were never asked.');
    }

    /**
     * @throws LiveValueRefused
     */
    private function hearCall(RecordingValues $values, int $index, string $method, string $path, string $body): void
    {
        $call = $this->calls[$index];

        if ($call['answered']->method !== $method) {
            throw LiveValueRefused::shape("call {$index} method", $method, $call['answered']->method);
        }

        $values->hear("call {$index} path", $call['answered']->path, $path);
        $sent = json_decode($call['asked']->body ?? '', true);
        $heard = json_decode($body, true);

        if (is_array($sent) && is_array($heard)) {
            $values->hear("call {$index} body", $sent, $heard);
        }
    }

    /**
     * The asking of the same method and path waiting before the answer, taken off the list; none for an answer whose
     * asking came before the recording run opened.
     *
     * @param  list<RecordedCall>  $waiting
     */
    private function takeAsking(array &$waiting, RecordedCall $answered): RecordedCall|null
    {
        foreach ($waiting as $index => $asked) {
            if ($asked->method === $answered->method && $asked->path === $answered->path) {
                array_splice($waiting, $index, 1);

                return $asked;
            }
        }

        return null;
    }
}
