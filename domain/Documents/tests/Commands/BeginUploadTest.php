<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\UploadInvalid;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * An agent begins an upload in its session of a declared type, size and digest, which waits for its parts; a size past the upload
 * limit is refused and begins nothing.
 */
final class BeginUploadTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_upload_begins_with_its_type_size_and_digest(): void
    {
        $this->journal->owner()->agent('Writer', 'writing-helper')->actAs('Writer');
        $text = "# Goal\nShip it.\n";

        $uploadId = $this->journal->run(new BeginUploadCommand(UploadType::DocumentBody, strlen($text), hash('sha256', $text)));

        $upload = TextUpload::query()->findOrFail($uploadId);
        $this->assertSame([UploadType::DocumentBody, strlen($text), 0], [$upload->type, $upload->bytes, $upload->received_bytes]);
    }

    public function test_a_size_past_the_limit_is_refused_and_begins_nothing(): void
    {
        $this->journal->owner()->agent('Writer', 'writing-helper')->actAs('Writer');

        $this->assertThrows(
            fn () => $this->journal->run(
                new BeginUploadCommand(UploadType::DocumentBody, BeginUploadCommand::MAX_BYTES + 1, hash('sha256', '')),
            ),
            UploadInvalid::class,
        );
        $this->assertSame(0, TextUpload::query()->count());
    }
}
