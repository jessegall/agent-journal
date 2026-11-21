<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Connections\Enums\CommandRunState;
use App\Connections\Values\CommandFrame;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One journal verb a connected machine ran on the server, by its request id: who ran it, for which binding, with
 * which arguments, its process while it runs, and its frames and exit code once it ended.
 *
 * @property string $id
 * @property string $request_key
 * @property string $agent_id
 * @property string $binding_id
 * @property list<string> $argv
 * @property CommandRunState $state
 * @property int|null $pid
 * @property int|null $exit_code
 * @property list<array{sequence: int, stream: string, text: string, isBase64: bool, exitCode: int}> $frames
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['request_key', 'agent_id', 'binding_id', 'argv', 'state'])]
final class ProjectCommandRun extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'argv' => 'array',
            'state' => CommandRunState::class,
            'frames' => 'array',
            'pid' => 'integer',
            'exit_code' => 'integer',
        ];
    }

    /**
     * @param  list<string>  $argv
     */
    public static function start(string $requestKey, string $agentId, ProjectBinding $binding, array $argv): self
    {
        $run = new self();
        $run->request_key = $requestKey;
        $run->agent_id = $agentId;
        $run->binding_id = $binding->id;
        $run->argv = $argv;
        $run->state = CommandRunState::Running;
        $run->frames = [];
        $run->save();

        return $run;
    }

    // ----------[ Queries ]----------

    /**
     * The run of this request id, locked until the transaction ends, if one was started.
     *
     * @return list<self>
     */
    public static function lockByRequest(string $requestKey): array
    {
        return array_values(self::query()->where('request_key', $requestKey)->lockForUpdate()->limit(1)->get()->all());
    }

    /**
     * The binding's running command streams, locked until the transaction ends; a binding runs a few at once.
     *
     * @return list<self>
     */
    public static function lockRunningOf(ProjectBinding $binding): array
    {
        return array_values(self::query()->where('binding_id', $binding->id)
            ->where('state', CommandRunState::Running)->lockForUpdate()
            ->readAll('a binding runs a few journal verbs at once')->get()->all());
    }

    // ----------[ Mutations ]----------

    public function recordProcess(int $pid): void
    {
        $this->pid = $pid;
        $this->save();
    }

    /**
     * @param  list<CommandFrame>  $frames
     */
    public function finish(array $frames, int $exitCode): void
    {
        $this->frames = array_map(fn (CommandFrame $frame) => $frame->toArray(), $frames);
        $this->exit_code = $exitCode;
        $this->state = CommandRunState::Finished;
        $this->save();
    }

    public function cancel(): void
    {
        $this->state = CommandRunState::Cancelled;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function isRunning(): bool
    {
        return $this->state === CommandRunState::Running;
    }

    /**
     * @return list<CommandFrame>
     */
    public function recordedFrames(): array
    {
        return array_map(CommandFrame::fromRecord(...), $this->frames);
    }
}
