<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Processes\CommandAliasLineRecorded;
use App\Models\Projects\Project;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Models\Support\ProjectMembership;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\ReadableModel;
use App\Values\AliasLookup;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string $project_id
 * @property string $name
 * @property string $line
 * @property int $revision
 * @property string $body_digest
 * @property list<string> $argument_grammar
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $lookup
 *
 * @mixin \Eloquent
 */
final class CommandAlias extends JournalModel implements EventSource, ProjectOwned, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use ProjectMembership;
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

    // ----------[ Constructors ]----------

    /**
     * The project's alias of this name, or a new one at revision 0 that is saved with its first body.
     */
    public static function create(Project $project, string $name): self
    {
        $existing = self::findNamedInProject($project, $name);

        if ($existing !== null) {
            return $existing;
        }

        $alias = new self();
        $alias->project_id = $project->id;
        $alias->name = $name;
        $alias->revision = 0;

        return $alias;
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
     * The project's alias of this name; none before its first.
     */
    public static function findNamedInProject(Project $project, string $name): self|null
    {
        return self::query()->inProject($project->id)->withName($name)->first();
    }

    // ----------[ Scopes ]----------

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
