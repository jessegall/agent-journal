<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Contracts\Bus\Command;
use App\Support\RecordIdentity;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Bus\ExpectedCommand;

/**
 * The tools/call an MCP tool's entry test sends: the start that signs it, the arguments, the commands the tool is
 * expected to send on with the reply the sink gives each, and a profile that does not see the tool.
 */
final class ToolCall
{
    /**
     * @var array<string, mixed>
     */
    public private(set) array $arguments = [];

    /**
     * @var list<ExpectedCommand>
     */
    public private(set) array $expected = [];

    /**
     * @var array<class-string<Command<mixed>>, mixed>
     */
    public private(set) array $replies = [];

    /**
     * A profile whose start is refused the tool, when some profile does not see it.
     */
    public private(set) string|null $hiddenFromProfile = null;

    private function __construct(public readonly TestStart|string $start) {}

    /**
     * @param  TestStart|string  $start  the TestStart, or the name of a start the test journal made
     */
    public static function by(TestStart|string $start): self
    {
        return new self($start);
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    public function arguments(array $arguments): self
    {
        $this->arguments = [...$this->arguments, ...$arguments];

        return $this;
    }

    /**
     * The record the tool works on, sent as its record_type and record_id arguments.
     */
    public function record(RecordIdentity $record): self
    {
        return $this->arguments(['record_type' => $record->type, 'record_id' => $record->id]);
    }

    public function expects(ExpectedCommand ...$expected): self
    {
        $this->expected = array_values($expected);

        return $this;
    }

    /**
     * The reply the sink gives each command of the class, a value of the command's own result type.
     *
     * @param  class-string<Command<mixed>>  $command
     */
    public function reply(string $command, mixed $reply): self
    {
        $this->replies[$command] = $reply;

        return $this;
    }

    public function hiddenFromProfile(string $profile): self
    {
        $this->hiddenFromProfile = $profile;

        return $this;
    }
}
