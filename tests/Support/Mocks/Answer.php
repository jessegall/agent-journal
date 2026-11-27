<?php

declare(strict_types=1);

namespace Tests\Support\Mocks;

use Tests\Support\Hosts\Steps\Contracts\HostStep;
use Tests\Support\Mocks\Exceptions\MockRefused;

/**
 * What a mock answers a line it expects, part after part: the recorded reply, a recorded notification, or a wait for
 * a test's step, every answer taken from a recording of the mock's build by its name.
 */
final class Answer
{
    /**
     * @var list<MockAction>
     */
    private array $actions = [];

    public function __construct(private readonly string $exchanges) {}

    /**
     * The mock replies as the recording's program replied to its first line of the method, with the heard line's
     * values in place of the recorded ones.
     */
    public function replies(string $recording): self
    {
        $this->actions[] = MockAction::reply($this->folderOf($recording));

        return $this;
    }

    /**
     * The mock prints each line of the method the recording's program printed after that reply.
     */
    public function notifies(string $recording, string $method): self
    {
        $this->actions[] = MockAction::notification($this->folderOf($recording), $method);

        return $this;
    }

    /**
     * The rest of the answer waits until the story ran the step.
     *
     * @param  class-string<HostStep>  $step
     */
    public function waitsFor(string $step): self
    {
        $this->actions[] = MockAction::wait(class_basename($step));

        return $this;
    }

    /**
     * @return list<MockAction>
     */
    public function actions(): array
    {
        return $this->actions;
    }

    private function folderOf(string $recording): string
    {
        $folder = "{$this->exchanges}/{$recording}";

        if (! is_file("{$folder}/fixture.json")) {
            throw MockRefused::noRecording($folder);
        }

        return $folder;
    }
}
