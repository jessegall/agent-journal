<?php

declare(strict_types=1);

namespace App\Models\Starts;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\Accessor;
use App\Values\SessionOutputPaths;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $session_id
 * @property string $start_id
 * @property int $mapping_generation
 * @property string $conversation_id
 * @property string $transcript_path
 * @property ?string $output_directory
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $paths attribute
 */
#[Fillable([
    'session_id',
    'start_id',
    'mapping_generation',
    'conversation_id',
    'transcript_path',
    'output_directory',
])]
final class SessionOutputGrant extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsRowSets;
    use Linkable;

    private const int MOST_GRANTS = 200;

    /**
     * @var list<string>
     */
    protected $hidden = [
        'transcript_path',
        'output_directory',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['mapping_generation' => 'integer'];
    }

    // ----------[ Constructors ]----------

    /**
     * Grants the start's session each conversation's output paths, in one insert.
     *
     * @param  array<array-key, SessionOutputPaths>  $pathsByConversation
     * @return list<string> the ids of the rows written
     */
    public static function createMany(ProcessStart $start, array $pathsByConversation): array
    {
        $grants = [];

        foreach ($pathsByConversation as $conversationId => $paths) {
            $grant = new self();
            $grant->session_id = $start->session_id;
            $grant->start_id = $start->id;
            $grant->mapping_generation = $start->output_generation;
            $grant->conversation_id = (string) $conversationId;
            $grant->transcript_path = $paths->transcriptPath;
            $grant->output_directory = $paths->outputDirectory;
            $grants[] = $grant;
        }

        return self::insertRows($grants);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<SessionOutputPaths, never>
     */
    protected function paths(): Attribute
    {
        return Accessor::get(fn () => new SessionOutputPaths($this->transcript_path, $this->output_directory));
    }

    // ----------[ Queries ]----------

    /**
     * The session's grants by conversation, whatever start made them: what a remap of the same session carries on.
     *
     * @return array<string, SessionOutputPaths>
     */
    public static function heldBy(string $sessionId): array
    {
        $grants = self::query()->ofSession($sessionId)->readLimit(self::MOST_GRANTS)->get();

        return $grants->mapWithKeys(fn (self $grant) => [$grant->conversation_id => $grant->paths])->all();
    }

    /**
     * The session's grants that count now: those of the given start in its newest mapping generation only.
     *
     * @return list<SessionOutputPaths>
     */
    public static function currentOf(ProcessStart $start): array
    {
        $grants = self::query()
            ->currentMappingOf($start)
            ->readLimit(self::MOST_GRANTS)
            ->get();

        return array_values($grants->map(fn (self $grant) => $grant->paths)->all());
    }

    // ----------[ Scopes ]----------

    /**
     * The session's grants.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSession(Builder $query, string $sessionId): void
    {
        $query->where('session_id', $sessionId);
    }

    /**
     * The grants of the start's current output mapping.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function currentMappingOf(Builder $query, ProcessStart $start): void
    {
        $query->ofSession($start->session_id)
            ->where('start_id', $start->id)
            ->where('mapping_generation', $start->output_generation);
    }
}
