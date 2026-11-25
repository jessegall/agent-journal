<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Contracts\Bus\Command;
use Illuminate\Database\Eloquent\Model;
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
     * The record the tool works on, sent as its record_type (the model's morph alias, its link type) and record_id.
     */
    public function forModel(Model $model): self
    {
        return $this->arguments(['record_type' => $model->getMorphClass(), 'record_id' => $model->getKey()]);
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
}
