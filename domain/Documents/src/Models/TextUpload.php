<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Sessions\SessionProvenance;
use App\Models\Support\BelongsToProject;
use App\Models\Support\JournalModel;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Events\TextUploadChunkCounted;
use Domain\Documents\Events\TextUploadConsumed;
use Domain\Documents\Events\TextUploadSealed;
use Domain\Documents\Exceptions\UploadChunkConflict;
use Domain\Documents\Exceptions\UploadExpired;
use Domain\Documents\Exceptions\UploadIncomplete;
use Domain\Documents\Exceptions\UploadInvalid;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $project_id
 * @property UploadType $type
 * @property int $bytes
 * @property string $digest
 * @property int $received_bytes
 * @property int $next_index
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $sealed_at
 * @property CarbonImmutable|null $consumed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class TextUpload extends JournalModel implements EventSource, ProjectOwned, ReadableModel
{
    use BelongsToProject;
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    public const int BYTE_LIMIT = 2 * 1024 * 1024;

    public const int CHUNK_BYTES = 48 * 1024;

    public const string SESSION_SCOPE = 'upload_session';

    protected $attributes = [
        'received_bytes' => 0,
        'next_index' => 0,
    ];

    protected function casts(): array
    {
        return [
            'type' => UploadType::class,
            'sealed_at' => 'immutable_datetime',
            'consumed_at' => 'immutable_datetime',
            'expires_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(UploadType $type, int $bytes, string $digest, ProjectOwner $owner): self
    {
        self::assertDeclarationValid($bytes, $digest);

        $textUpload = new self();
        $textUpload->project_id = $owner->projectId();
        $textUpload->type = $type;
        $textUpload->bytes = $bytes;
        $textUpload->digest = strtolower($digest);
        $textUpload->expires_at = CarbonImmutable::now()->addDay();
        $textUpload->saveAndAssert();

        return $textUpload;
    }

    // ----------[ Mutations ]----------

    /**
     * Whether the chunk at this position was already received with this text; a chunk that does not fit next, or
     * repeats a position with other text, is refused.
     *
     * @throws UploadInvalid
     * @throws UploadChunkConflict
     */
    public function hasReceivedChunk(int $position, string $text, string $digest): bool
    {
        self::assertChunkValid($text, $digest);

        if ($position >= 0 && $position < $this->next_index) {
            $this->assertSameChunkAt($position, $text);

            return true;
        }

        $this->assertNextChunk($position, strlen($text));

        return false;
    }

    /**
     * Counts the chunk just stored as received.
     */
    public function countChunk(int $bytes): void
    {
        $this->received_bytes += $bytes;
        $this->next_index++;
        $this->saveAndAssert();
        $this->raise(new TextUploadChunkCounted($this->id));
    }

    public function seal(): void
    {
        if ($this->sealed_at !== null) {
            return;
        }

        $this->assertComplete();

        $this->sealed_at = CarbonImmutable::now();
        $this->saveAndAssert();
        $this->raise(new TextUploadSealed($this->id));
    }

    public function consume(UploadType $type): string
    {
        $this->assertConsumableAs($type);

        $body = $this->body();
        $this->consumed_at = CarbonImmutable::now();
        $this->saveAndAssert();
        $this->raise(new TextUploadConsumed($this->id));

        return $body;
    }

    // ----------[ Calculations ]----------

    public function attachmentText(): string
    {
        return $this->body();
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a declared size outside the limit, or a digest that is not one.
     *
     * @throws UploadInvalid
     */
    private static function assertDeclarationValid(int $bytes, string $digest): void
    {
        if ($bytes < 1 || $bytes > self::BYTE_LIMIT || ! self::isDigest($digest)) {
            throw UploadInvalid::forDeclaration();
        }
    }

    /**
     * Refuses a chunk that is empty, too large, not UTF-8, or does not match its digest.
     *
     * @throws UploadInvalid
     */
    private static function assertChunkValid(string $text, string $digest): void
    {
        $bytes = strlen($text);

        if ($bytes < 1 || $bytes > self::CHUNK_BYTES || ! mb_check_encoding($text, 'UTF-8')
            || ! hash_equals(hash('sha256', $text), strtolower($digest))) {
            throw UploadInvalid::forChunk();
        }
    }

    /**
     * Refuses a chunk sent again at a position that holds another text.
     *
     * @throws UploadChunkConflict
     */
    private function assertSameChunkAt(int $position, string $text): void
    {
        $chunk = TextUploadChunk::query()->ofUpload($this->id)->atPosition($position)->sole();

        if ($chunk->text !== $text) {
            throw UploadChunkConflict::atPosition();
        }
    }

    /**
     * Refuses a chunk that is not the next one, overruns the declared size, or comes after the seal.
     *
     * @throws UploadInvalid
     */
    private function assertNextChunk(int $position, int $bytes): void
    {
        if ($position !== $this->next_index || $this->received_bytes + $bytes > $this->bytes
            || $this->sealed_at !== null) {
            throw UploadInvalid::forChunk();
        }
    }

    /**
     * Refuses a seal of an upload that is short of its size or does not match its digest.
     *
     * @throws UploadIncomplete
     */
    private function assertComplete(): void
    {
        if ($this->received_bytes !== $this->bytes || ! hash_equals($this->digest, hash('sha256', $this->body()))) {
            throw UploadIncomplete::forUpload();
        }
    }

    /**
     * Refuses an upload of another type or already used as expired, and one not sealed as incomplete.
     *
     * @throws UploadExpired
     * @throws UploadIncomplete
     */
    private function assertConsumableAs(UploadType $type): void
    {
        if ($this->type !== $type || $this->consumed_at !== null) {
            throw UploadExpired::forUpload();
        }

        if ($this->sealed_at === null) {
            throw UploadIncomplete::forUpload();
        }
    }

    // ----------[ Internals ]----------

    private function body(): string
    {
        $body = '';
        $chunks = TextUploadChunk::query()->ofUpload($this->id)->inPositionOrder();

        foreach ($chunks->readExactly($this->next_index)->cursor() as $chunk) {
            $body .= $chunk->text;
        }

        return $body;
    }

    private static function isDigest(string $digest): bool
    {
        return strlen($digest) === 64 && ctype_xdigit($digest);
    }

    // ----------[ Queries ]----------

    public static function findLocked(string $id): self
    {
        return self::query()
            ->unexpired()
            ->whereKey($id)
            ->lockForUpdate()
            ->firstOr(UploadExpired::throwing()->forUpload());
    }

    public static function findSealed(string $id): self
    {
        return self::query()->unexpired()->alreadySealed()->findOr($id, UploadExpired::throwing()->forUpload());
    }

    /**
     * The sealed upload as the given session reads it: its own uploads only.
     *
     * @throws UploadExpired
     */
    public static function findSealedFor(SessionProvenance $sessions, string $sessionId, string $id): self
    {
        $uploads = self::query()->withoutGlobalScope(self::SESSION_SCOPE);

        return $sessions
            ->fromSession($uploads, $sessionId)
            ->unexpired()
            ->alreadySealed()
            ->findOr($id, UploadExpired::throwing()->forUpload());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unexpired(Builder $query): void
    {
        $query->where('expires_at', '>', CarbonImmutable::now());
    }

    /**
     * The uploads already sealed.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function alreadySealed(Builder $query): void
    {
        $query->whereNotNull('sealed_at');
    }

    /**
     * The uploads no read has taken yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unconsumed(Builder $query): void
    {
        $query->whereNull('consumed_at');
    }

    /**
     * The uploads of every session, not only the current one.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function acrossSessions(Builder $query): void
    {
        $query->withoutGlobalScope(self::SESSION_SCOPE);
    }

    /**
     * The uploads expired at the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function expiredAt(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('expires_at', '<=', $moment);
    }
}
