<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Contracts\Bus\CommandTransaction;
use App\Contracts\Sessions\SessionProvenance;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\UploadLimitReached;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Models\TextUploadChunk;
use Illuminate\Database\DatabaseManager;

final readonly class UploadStore
{
    private const int ACTIVE_UPLOADS = 4;

    public function __construct(
        private SessionProvenance $provenance,
        private CommandTransaction $transaction,
        private DatabaseManager $database,
    ) {}

    public function begin(UploadType $type, int $bytes, string $digest, ProjectOwner $owner): string
    {
        if (TextUpload::query()->unexpired()->unconsumed()->count() >= self::ACTIVE_UPLOADS) {
            throw UploadLimitReached::forSession();
        }

        $upload = TextUpload::create($type, $bytes, $digest, $owner);
        $this->provenance->record($upload);

        return $upload->id;
    }

    public function append(string $uploadId, int $index, string $text, string $digest): void
    {
        $upload = TextUpload::findLocked($uploadId);

        if ($upload->hasReceivedChunk($index, $text, $digest)) {
            return;
        }

        TextUploadChunk::create($upload, $index, $text);
        $upload->countChunk(strlen($text));
    }

    /**
     * Deletes every upload whose time ran out, a hundred at a time, whoever began it.
     */
    public function pruneExpired(): void
    {
        TextUpload::query()->acrossSessions()
            ->expiredAt(CarbonImmutable::now())
            ->readInChunks(100, function ($uploads): void {
                $uploads->each(fn (TextUpload $upload) => $upload->delete());
            });
    }

    public function seal(string $uploadId): void
    {
        TextUpload::findLocked($uploadId)->seal();
    }

    public function discard(string $uploadId): void
    {
        TextUpload::findLocked($uploadId)->delete();
    }

    public function consume(string $uploadId, UploadType $type): string
    {
        $this->transaction->assertRunning($this->database->connection());

        return TextUpload::findLocked($uploadId)->consume($type);
    }
}
