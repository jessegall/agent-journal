<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\UploadChunkConflict;
use Domain\Documents\Exceptions\UploadExpired;
use Domain\Documents\Exceptions\UploadIncomplete;
use Domain\Documents\Exceptions\UploadInvalid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property UploadType $type
 * @property int $bytes
 * @property string $digest
 * @property int $received_bytes
 * @property int $next_index
 * @property CarbonImmutable|null $sealed_at
 * @property CarbonImmutable|null $consumed_at
 */
#[Fillable(['type', 'bytes', 'digest', 'expires_at'])]
final class TextUpload extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'documents.upload';

    public const int BYTE_LIMIT = 2 * 1024 * 1024;

    public const int CHUNK_BYTES = 48 * 1024;

    public const string SESSION_SCOPE = 'upload_session';

    protected $attributes = ['received_bytes' => 0, 'next_index' => 0];

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return [
            'type' => UploadType::class,
            'sealed_at' => 'immutable_datetime',
            'consumed_at' => 'immutable_datetime',
        ];
    }

    public static function begin(UploadType $type, int $bytes, string $digest): self
    {
        if ($bytes < 1 || $bytes > self::BYTE_LIMIT || ! self::isDigest($digest)) {
            throw UploadInvalid::forDeclaration();
        }

        return self::query()->create([
            'type' => $type,
            'bytes' => $bytes,
            'digest' => strtolower($digest),
            'expires_at' => CarbonImmutable::now()->addDay(),
        ]);
    }

    // ----------[ Queries ]----------

    public static function locked(string $id): self
    {
        return self::query()->unexpired()->whereKey($id)->lockForUpdate()->firstOr(
            fn () => throw UploadExpired::forUpload(),
        );
    }

    public static function sealed(string $id): self
    {
        return self::query()->unexpired()->whereNotNull('sealed_at')->findOr(
            $id,
            fn () => throw UploadExpired::forUpload(),
        );
    }

    public static function pruneExpired(): void
    {
        self::query()->withoutGlobalScope(self::SESSION_SCOPE)
            ->where('expires_at', '<=', CarbonImmutable::now())
            ->readInChunks(100, function ($uploads): void {
                $uploads->each(fn (self $upload) => $upload->delete());
            });
    }

    // ----------[ Mutations ]----------

    public function appendChunk(int $position, string $text, string $digest): void
    {
        $bytes = strlen($text);

        if ($bytes < 1 || $bytes > self::CHUNK_BYTES || ! mb_check_encoding($text, 'UTF-8')
            || ! hash_equals(hash('sha256', $text), strtolower($digest))) {
            throw UploadInvalid::forChunk();
        }

        if ($position >= 0 && $position < $this->next_index) {
            $chunk = TextUploadChunk::query()->where('upload_id', $this->id)->where('position', $position)->sole();

            if ($chunk->text() !== $text) {
                throw UploadChunkConflict::atPosition();
            }

            return;
        }

        if ($position !== $this->next_index || $this->received_bytes + $bytes > $this->bytes
            || $this->sealed_at !== null) {
            throw UploadInvalid::forChunk();
        }

        TextUploadChunk::store($this, $position, $text);
        $this->received_bytes += $bytes;
        $this->next_index++;
        $this->save();
    }

    public function seal(): void
    {
        if ($this->sealed_at !== null) {
            return;
        }

        if ($this->received_bytes !== $this->bytes || ! hash_equals($this->digest, hash('sha256', $this->body()))) {
            throw UploadIncomplete::forUpload();
        }

        $this->sealed_at = CarbonImmutable::now();
        $this->save();
    }

    public function consume(UploadType $type): string
    {
        if ($this->type !== $type || $this->consumed_at !== null) {
            throw UploadExpired::forUpload();
        }

        if ($this->sealed_at === null) {
            throw UploadIncomplete::forUpload();
        }

        $body = $this->body();
        $this->consumed_at = CarbonImmutable::now();
        $this->save();

        return $body;
    }

    // ----------[ Answers ]----------

    public function attachmentText(): string
    {
        return $this->body();
    }

    // ----------[ Internals ]----------

    private function body(): string
    {
        $body = '';
        $chunks = TextUploadChunk::query()->where('upload_id', $this->id)->orderBy('position');

        foreach ($chunks->readLimit($this->next_index)->cursor() as $chunk) {
            $body .= $chunk->text();
        }

        return $body;
    }

    private static function isDigest(string $digest): bool
    {
        return strlen($digest) === 64 && ctype_xdigit($digest);
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
}
