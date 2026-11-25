<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Processes\CommandAliasLineRecorded;
use App\Models\Support\Accessor;
use App\Values\AliasLookup;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $project_key
 * @property string $name
 * @property string $line
 * @property int $revision
 * @property string $body_digest
 * @property array $argument_grammar
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $lookup attribute
 */
final class CommandAlias extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     *
     * @column argument_grammar list<string>
     */
    protected function casts(): array
    {
        return [
            'argument_grammar' => 'array',
            'revision' => 'integer',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * Saves a body under the alias: a new alias starts at revision 1, a changed body is the next revision.
     *
     * @param  list<string>  $arguments  the names of the positional arguments the body takes
     */
    public function recordLine(string $line, array $arguments = []): void
    {
        $this->line = $line;
        $this->argument_grammar = $arguments;
        $this->body_digest = hash('sha256', $line);
        $this->revision = $this->revision + 1;
        $this->save();
        $this->raise(new CommandAliasLineRecorded($this->id));
    }

    // ----------[ Accessors ]----------

    /**
     * The alias as the classifier reads it: found, with its body, revision, digest and declared arguments.
     *
     * @return Attribute<AliasLookup, never>
     */
    protected function lookup(): Attribute
    {
        return Accessor::get(fn () => AliasLookup::found(
            $this->id,
            $this->name,
            $this->line,
            $this->revision,
            $this->body_digest,
            $this->argument_grammar,
        ));
    }

    // ----------[ Queries ]----------

    /**
     * The project's alias of this name, or a new one at revision 0 that is saved with its first body.
     */
    public static function forName(string $projectKey, string $name): self
    {
        $existing = self::query()->named($name, $projectKey)->first();

        if ($existing !== null) {
            return $existing;
        }

        $alias = new self();
        $alias->project_key = $projectKey;
        $alias->name = $name;
        $alias->revision = 0;

        return $alias;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function named(Builder $query, string $name, string $projectKey): void
    {
        $query->where('project_key', $projectKey)->where('name', $name);
    }

    /**
     * The rows of the given name.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withName(Builder $query, string $name): void
    {
        $query->where('name', $name);
    }
}
