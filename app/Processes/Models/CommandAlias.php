<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
use App\Processes\Values\AliasLookup;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A test, build or other long command line kept under a name, its alias, so an agent runs it as journal <name> or
 * journal run <name>. Each change is a new revision with the digest of its body, and the positional arguments it
 * takes are declared by name, never pasted into the body.
 *
 * @property string $id
 * @property string $project_key
 * @property string $name
 * @property string $line
 * @property int $revision
 * @property string $body_digest
 * @property list<string> $argument_grammar
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['project_key', 'name', 'line', 'revision', 'body_digest', 'argument_grammar'])]
final class CommandAlias extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    protected function casts(): array
    {
        return ['argument_grammar' => 'array', 'revision' => 'integer'];
    }

    /**
     * Saves a body under a name for a project: a new alias starts at revision 1, a changed body is the next revision.
     *
     * @param  list<string>  $arguments  the names of the positional arguments the body takes
     */
    public static function record(string $projectKey, string $name, string $line, array $arguments = []): self
    {
        $alias = self::query()->named($name, $projectKey)->first() ?? new self(
            ['project_key' => $projectKey, 'name' => $name, 'revision' => 0],
        );
        $alias->fill(
            [
                'line' => $line,
                'argument_grammar' => $arguments,
                'body_digest' => hash('sha256', $line),
                'revision' => $alias->revision + 1,
            ],
        )->save();

        return $alias;
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function named(Builder $query, string $name, string $projectKey): void
    {
        $query->where('project_key', $projectKey)->where('name', $name);
    }

    /**
     * The alias as the classifier reads it: found, with its body, revision, digest and declared arguments.
     */
    public function lookup(): AliasLookup
    {
        return AliasLookup::found(
            $this->id,
            $this->name,
            $this->line,
            $this->revision,
            $this->body_digest,
            $this->argument_grammar,
        );
    }
}
