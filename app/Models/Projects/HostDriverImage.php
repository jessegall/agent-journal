<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\DriverImageAdmitted;
use App\Events\Connections\DriverImageAllowed;
use App\Events\Connections\DriverImageAllowReset;
use App\Events\Connections\DriverImageAllowSetSent;
use App\Events\Connections\DriverImageBuildFinished;
use App\Events\Connections\DriverImageBuildSent;
use App\Events\Connections\DriverImageChecksSent;
use App\Events\Connections\DriverImageRefused;
use App\Events\Connections\DriverImageReplaced;
use App\Exceptions\HostDriverImageUnbuilt;
use App\Hosts\Enums\DriverImagePhase;
use App\Hosts\Enums\DriverImageStatus;
use App\Models\Agents\AgentSession;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * One driver image recipe on one host, from its reservation to ready or refused: the one row each host keeps per
 * recipe, which the build, the allow set and the start checks move along. Only the instruction of its present phase
 * moves it, so a late answer to an earlier one changes nothing.
 *
 * @property string $id
 * @property string $host_id
 * @property string $driver_image_recipe_id
 * @property DriverImageStatus $status
 * @property int $attempt
 * @property int $failures
 * @property string|null $build_instruction_id
 * @property string|null $allow_instruction_id
 * @property string|null $check_instruction_id
 * @property string|null $image
 * @property string|null $refusal
 * @property CarbonImmutable|null $ready_at
 */
#[Table('host_driver_images')]
final class HostDriverImage extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * How many recoveries in a row may fail before the image is refused: an interruption, an image the daemon lost or
     * a daemon out of reach, with no ready image between.
     */
    public const int RECOVERY_LIMIT = 3;

    /**
     * The statuses whose image the host's allow set names: waiting for the runner, being checked, or ready.
     */
    private const array ALLOWED_STATUSES = [
        DriverImageStatus::Allowing,
        DriverImageStatus::Checking,
        DriverImageStatus::Ready,
    ];

    protected function casts(): array
    {
        return [
            'status' => DriverImageStatus::class,
            'attempt' => 'integer',
            'failures' => 'integer',
            'ready_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The host's one row of the recipe, reserved pending when it is new and locked until the transaction ends; the
     * unique host and recipe pair keeps two starts that reserve it at once to one row.
     */
    public static function create(Host $host, DriverImageRecipeRecord $recipe): self
    {
        $image = new self();
        $image->host_id = $host->id;
        $image->driver_image_recipe_id = $recipe->id;
        $image->status = DriverImageStatus::Pending;
        $image->attempt = 0;
        $image->failures = 0;
        $image->setAttribute($image->getKeyName(), $image->newUniqueId());
        $image->insertIfAbsent();

        return self::findLockedOfRecipeOn($host->id, $recipe->id);
    }

    // ----------[ Mutations ]----------

    /**
     * The build of a pending image is sent as this instruction.
     */
    public function startAttempt(string $instructionId): void
    {
        $this->status = DriverImageStatus::Building;
        $this->attempt++;
        $this->build_instruction_id = $instructionId;
        $this->saveAndAssert();
        $this->raise(new DriverImageBuildSent($this->id, $instructionId));
    }

    /**
     * The build gave this image; the runner must allow it before its checks run.
     */
    public function built(string $image): void
    {
        $this->status = DriverImageStatus::Allowing;
        $this->image = $image;
        $this->saveAndAssert();
        $this->raise(new DriverImageBuildFinished($this->id, $image));
    }

    /**
     * The host's allow set that names this image went out as this instruction.
     */
    public function orderedIn(string $allowInstructionId): void
    {
        $this->allow_instruction_id = $allowInstructionId;
        $this->saveAndAssert();
        $this->raise(new DriverImageAllowSetSent($this->id, $allowInstructionId));
    }

    /**
     * The runner allowed the image, so its start checks may run.
     */
    public function acknowledged(): void
    {
        $this->status = DriverImageStatus::Checking;
        $this->saveAndAssert();
        $this->raise(new DriverImageAllowed($this->id));
    }

    /**
     * The start checks went out as this instruction.
     */
    public function markChecksSent(string $instructionId): void
    {
        $this->check_instruction_id = $instructionId;
        $this->saveAndAssert();
        $this->raise(new DriverImageChecksSent($this->id, $instructionId));
    }

    /**
     * The start checks passed: the image is ready, and its recoveries count from nothing again.
     */
    public function checked(): void
    {
        $this->status = DriverImageStatus::Ready;
        $this->failures = 0;
        $this->ready_at = CarbonImmutable::now();
        $this->saveAndAssert();
        $this->raise(new DriverImageAdmitted($this->id));
    }

    /**
     * Removes this image's row and reports the built image for removal from Docker after commit.
     */
    public function retire(): void
    {
        $this->deleteAndAssert();

        if ($this->image !== null) {
            $this->raise(new DriverImageReplaced($this->id, $this->host_id, $this->image));
        }
    }

    /**
     * The host restarted: a ready image goes back to be allowed by the runner that now runs.
     */
    public function reallow(): void
    {
        $this->status = DriverImageStatus::Allowing;
        $this->allow_instruction_id = null;
        $this->saveAndAssert();
        $this->raise(new DriverImageAllowReset($this->id));
    }

    /**
     * The phase's instruction was lost to a restart, an expiry or a daemon out of reach: the image is built again,
     * unless that was the last recovery it had.
     */
    public function interrupted(string $why): void
    {
        $this->recover($why);
    }

    /**
     * The daemon no longer holds the image: it is built again, unless that was the last recovery it had.
     */
    public function absent(): void
    {
        $this->image = null;
        $this->recover('the Docker daemon no longer holds the image');
    }

    /**
     * The image is refused for good, with why.
     */
    public function refuse(string $why): void
    {
        $this->status = DriverImageStatus::Refused;
        $this->refusal = $why;
        $this->saveAndAssert();
        $this->raise(new DriverImageRefused($this->id));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the instruction is the one this row waits on in the phase, so its answer may move the row.
     */
    public function isCurrent(string $instructionId, DriverImagePhase $phase): bool
    {
        return match ($phase) {
            DriverImagePhase::Build => $this->status === DriverImageStatus::Building
                && $this->build_instruction_id === $instructionId,
            DriverImagePhase::Allow => $this->status === DriverImageStatus::Allowing
                && $this->allow_instruction_id === $instructionId,
            DriverImagePhase::Check => $this->status === DriverImageStatus::Checking
                && $this->check_instruction_id === $instructionId,
        };
    }

    /**
     * Whether the instruction is the one the image's present phase waits on, whichever phase that is.
     */
    public function waitsOn(string $instructionId): bool
    {
        return $this->isCurrent($instructionId, DriverImagePhase::Build)
            || $this->isCurrent($instructionId, DriverImagePhase::Allow)
            || $this->isCurrent($instructionId, DriverImagePhase::Check);
    }

    public function isReady(): bool
    {
        return $this->status === DriverImageStatus::Ready;
    }

    public function isRefused(): bool
    {
        return $this->status === DriverImageStatus::Refused;
    }

    public function isPending(): bool
    {
        return $this->status === DriverImageStatus::Pending;
    }

    // ----------[ Calculations ]----------

    /**
     * The image the build gave, which every row past its build holds.
     */
    public function builtImage(): string
    {
        $this->assertBuilt();

        return (string) $this->image;
    }

    // ----------[ Asserts ]----------

    /**
     * @throws HostDriverImageUnbuilt for a row whose build gave no image yet
     */
    private function assertBuilt(): void
    {
        if ($this->image === null) {
            throw HostDriverImageUnbuilt::of($this->id);
        }
    }

    // ----------[ Internals ]----------

    private function recover(string $why): void
    {
        $this->failures++;

        if ($this->failures >= self::RECOVERY_LIMIT) {
            $this->refuse("{$why}; recovery failed {$this->failures} times in a row");

            return;
        }

        $this->status = DriverImageStatus::Pending;
        $this->build_instruction_id = null;
        $this->allow_instruction_id = null;
        $this->check_instruction_id = null;
        $this->saveAndAssert();
    }

    // ----------[ Queries ]----------

    /**
     * The images this ready recipe replaces on its host, excluding recipes still frozen by a live session.
     *
     * @return Collection<int, self>
     */
    public static function findReplacedBy(self $image, string $folder): Collection
    {
        $frozen = AgentSession::query()->liveOnFrozenRecipe()->select('driver_recipe_digest');
        $recipes = DriverImageRecipeRecord::query()
            ->where('folder', $folder)
            ->whereNotIn('recipe_digest', $frozen)
            ->select('id');

        return self::query()
            ->onHost($image->host_id)
            ->whereKeyNot($image->id)
            ->whereIn('driver_image_recipe_id', $recipes)
            ->lockForUpdate()
            ->get();
    }

    /**
     * The image row, locked until the transaction ends.
     */
    public static function findLocked(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * The host's row of the recipe, locked.
     */
    public static function findLockedOfRecipeOn(string $hostId, string $recipeId): self
    {
        return self::query()->onHost($hostId)->ofRecipe($recipeId)->lockForUpdate()->firstOrFail();
    }

    /**
     * The built images of the host a container may run now or after its checks: those waiting for the runner to allow
     * them, being checked, or ready.
     *
     * @return list<string>
     */
    public static function resolveAllowedImagesOn(string $hostId): array
    {
        $images = self::query()->onHost($hostId)->inStatuses(self::ALLOWED_STATUSES)->withImage()->oldestFirst()
            ->pluck('image');

        return array_values(array_unique(array_map(strval(...), $images->all())));
    }

    /**
     * Every ready driver image of every host: built, allowed and checked.
     *
     * @return list<string>
     */
    public static function resolveReadyImages(): array
    {
        $images = self::query()->inStatuses([DriverImageStatus::Ready])->withImage()->oldestFirst()->pluck('image');

        return array_values(array_unique(array_map(strval(...), $images->all())));
    }

    /**
     * The images the host holds ready of the recipes built from the folder.
     *
     * @return list<string>
     */
    public static function resolveReadyImagesOf(string $hostId, string $folder): array
    {
        return array_values(array_map(
            fn (self $image) => (string) $image->image,
            self::query()
                ->onHost($hostId)
                ->inStatuses([DriverImageStatus::Ready])
                ->whereIn('driver_image_recipe_id', DriverImageRecipeRecord::query()->where('folder', $folder)->select('id'))
                ->get()
                ->all(),
        ));
    }

    /**
     * Whether an image of the host waits to be allowed with no allow set of its own yet, as after a rebuild.
     */
    public static function hasUnorderedOn(string $hostId): bool
    {
        return self::query()->onHost($hostId)->inStatuses([DriverImageStatus::Allowing])->unordered()->exists();
    }

    /**
     * The host's images waiting for the runner to allow them, locked, so the set that names them is recorded on each.
     *
     * @return list<self>
     */
    public static function findAllowingOn(string $hostId): array
    {
        return self::findLockedOn($hostId, DriverImageStatus::Allowing);
    }

    /**
     * The host's images not built yet.
     *
     * @return list<self>
     */
    public static function findPendingOn(string $hostId): array
    {
        return array_values(self::query()->onHost($hostId)->inStatuses([DriverImageStatus::Pending])->oldestFirst()
            ->get()
            ->all());
    }

    /**
     * Whether the host has an image still being allowed or checked, as each is again after the host restarted.
     */
    public static function isAdmittingOn(string $hostId): bool
    {
        return self::query()->onHost($hostId)->inStatuses([
            DriverImageStatus::Allowing,
            DriverImageStatus::Checking,
        ])->exists();
    }

    /**
     * The host's images it was allowed, or was being allowed or checked for, locked: a host that restarted holds none
     * of them any more, so each is allowed again.
     *
     * @return list<self>
     */
    public static function findAdmittedOn(string $hostId): array
    {
        return array_values(self::query()
            ->onHost($hostId)
            ->inStatuses([DriverImageStatus::Allowing, DriverImageStatus::Checking, DriverImageStatus::Ready])
            ->lockForUpdate()
            ->get()
            ->all());
    }

    /**
     * The host's images whose build, allow set or checks went out as this instruction, locked.
     *
     * @return list<self>
     */
    public static function findWaitingOn(string $instructionId): array
    {
        return array_values(self::query()->sentAs($instructionId)->lockForUpdate()->get()->all());
    }

    /**
     * The host's images in the status, locked.
     *
     * @return list<self>
     */
    private static function findLockedOn(string $hostId, DriverImageStatus $status): array
    {
        return array_values(self::query()->onHost($hostId)->inStatuses([$status])->lockForUpdate()->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * The images of the host.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onHost(Builder $query, string $hostId): void
    {
        $query->where('host_id', $hostId);
    }

    /**
     * The images of the recipe.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRecipe(Builder $query, string $recipeId): void
    {
        $query->where('driver_image_recipe_id', $recipeId);
    }

    /**
     * The images in one of the statuses.
     *
     * @param  Builder<self>  $query
     * @param  list<DriverImageStatus>  $statuses
     */
    #[Scope]
    protected function inStatuses(Builder $query, array $statuses): void
    {
        $query->whereIn('status', array_map(fn (DriverImageStatus $status) => $status->value, $statuses));
    }

    /**
     * The images whose build gave an image.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withImage(Builder $query): void
    {
        $query->whereNotNull('image');
    }

    /**
     * The images no allow set named yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unordered(Builder $query): void
    {
        $query->whereNull('allow_instruction_id');
    }

    /**
     * The images whose build, allow set or checks went out as the instruction.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sentAs(Builder $query, string $instructionId): void
    {
        $query->where(fn (Builder $sent) => $sent->where('build_instruction_id', $instructionId)
            ->orWhere('allow_instruction_id', $instructionId)
            ->orWhere('check_instruction_id', $instructionId));
    }
}
