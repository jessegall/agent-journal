<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Agents\Contracts\SessionProvenance;
use App\Bus\Contracts\CommandTransaction;
use Domain\Documents\Contracts\SealedUploads;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\UploadLimitReached;
use Domain\Documents\Models\TextUpload;
use Illuminate\Database\DatabaseManager;

final readonly class UploadStore implements SealedUploads
{
    private const int ACTIVE_UPLOADS = 4;

    public function __construct(
        private SessionProvenance $provenance,
        private CommandTransaction $transaction,
        private DatabaseManager $database,
    ) {}

    public function begin(UploadType $type, int $bytes, string $digest): string
    {
        if (TextUpload::query()->unexpired()->whereNull('consumed_at')->count() >= self::ACTIVE_UPLOADS) {
            throw UploadLimitReached::forSession();
        }

        $upload = TextUpload::create($type, $bytes, $digest);
        $this->provenance->record($upload);

        return $upload->id;
    }

    public function append(string $uploadId, int $index, string $text, string $digest): void
    {
        TextUpload::locked($uploadId)->appendChunk($index, $text, $digest);
    }

    public function seal(string $uploadId): void
    {
        TextUpload::locked($uploadId)->seal();
    }

    public function discard(string $uploadId): void
    {
        TextUpload::locked($uploadId)->delete();
    }

    public function consume(string $uploadId, UploadType $type): string
    {
        $this->transaction->assertRunning($this->database->connection());

        return TextUpload::locked($uploadId)->consume($type);
    }
}
