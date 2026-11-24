<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Support\ActorIdentity;
use App\Values\RuleBundle;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A project owner's activation of one module's rule bundle at one version and digest:
 * only a bundle with this record classifies; a changed digest waits for a new one.
 *
 * @property string $id
 * @property string $project_key
 * @property string $module
 * @property string $version
 * @property string $digest
 * @property string $approver_type
 * @property string $approver_id
 * @property Carbon $approved_at
 */
#[Fillable(['project_key', 'module', 'version', 'digest', 'approver_type', 'approver_id'])]
final class ModuleRuleBundle extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    public const string CREATED_AT = 'approved_at';

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['approved_at' => 'datetime'];
    }

    // ----------[ Queries ]----------

    public static function approve(string $projectKey, RuleBundle $bundle, ActorIdentity $approver): self
    {
        $identity = [
            'project_key' => $projectKey,
            'module' => $bundle->module,
            'version' => $bundle->version,
            'digest' => $bundle->digest(),
        ];

        $approval = new self([...$identity, 'approver_type' => $approver->type->value, 'approver_id' => $approver->id]);
        $approval->setAttribute($approval->getKeyName(), $approval->newUniqueId());
        $approval->insertIfAbsent();

        return self::query()->where($identity)->sole();
    }

    // ----------[ Answers ]----------

    public function approves(RuleBundle $bundle): bool
    {
        return $this->module === $bundle->module
            && $this->version === $bundle->version
            && $this->digest === $bundle->digest();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }
}
