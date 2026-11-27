<?php

declare(strict_types=1);

namespace Tests\Support\Mocks;

use Closure;
use JsonSerializable;

/**
 * The script of a program's mock on the test host: each line it expects to hear, in order, and what it answers, from
 * the recordings of its build. The Go mock plays it and fails on a line it did not expect.
 */
abstract class Mock implements JsonSerializable
{
    /**
     * @var list<MockStep>
     */
    private array $steps = [];

    final protected function __construct(private readonly string $driver, private readonly string $build) {}

    /**
     * The next line the mock reads is of the method, and the scope says what it answers.
     *
     * @param  Closure(Answer): mixed  $answer
     */
    public function expects(string $method, Closure $answer): static
    {
        $reply = new Answer($this->exchanges());
        $answer($reply);
        $this->steps[] = new MockStep($method, $reply->actions());

        return $this;
    }

    /**
     * The script's file in the test host's mocks folder, where the program's mock reads it.
     */
    abstract public function scriptName(): string;

    /**
     * The program the mock answers for, as a failure names it.
     */
    abstract public function program(): string;

    /**
     * The recording whose lines printed before any input open the mock's answer; none for a program that waits.
     */
    abstract protected function opening(): string;

    /**
     * Whether each run of the mock ends once it answered a step, as a login does, so the next run takes the next step.
     */
    abstract protected function endsAfterEach(): bool;

    /**
     * The methods of the lines the mock expects, in order.
     *
     * @return list<string>
     */
    public function methods(): array
    {
        return array_map(fn (MockStep $step) => $step->method, $this->steps);
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        $opening = $this->opening() === '' ? '' : "{$this->exchanges()}/{$this->opening()}";

        return [
            'program' => $this->program(),
            'opening' => $opening,
            'exitCode' => $opening === '' ? 0 : self::exitCodeOf($opening),
            'endsAfterEach' => $this->endsAfterEach(),
            'steps' => $this->steps,
        ];
    }

    /**
     * The folder the recorded exchanges of the mock's build are kept in.
     */
    protected function exchanges(): string
    {
        return base_path("resources/recordings/{$this->driver}/{$this->build}/exchanges");
    }

    private static function exitCodeOf(string $recording): int
    {
        $fixture = json_decode(
            (string) file_get_contents("{$recording}/fixture.json"),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        return (int) $fixture['exit_code'];
    }
}
