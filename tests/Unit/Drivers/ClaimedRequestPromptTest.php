<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Contracts\MessagePart;
use App\Messages\Data\MessageAttachmentData;
use App\Messages\Data\MessageTextData;
use App\Values\ClaimedRequest;
use PHPUnit\Framework\TestCase;

/**
 * A claimed request tells its turn its message, or else its parts as lines, an attachment by how the agent reads it,
 * as the host's drivers write a delivery's prompt.
 */
final class ClaimedRequestPromptTest extends TestCase
{
    public function test_a_delivery_is_told_its_parts_and_a_wake_its_message(): void
    {
        $parts = [new MessageTextData('Read this.'), new MessageAttachmentData('attachment-1', 'sha256:ab', 'plan.md')];
        $attachment = 'Attachment "plan.md": read it with the attachments_read tool, attachment_id attachment-1.';

        $this->assertSame(
            ["Read this.\n\n{$attachment}", 'Pending work.', null],
            [
                $this->claimed(null, $parts)->prompt(),
                $this->claimed('Pending work.', [])->prompt(),
                $this->claimed(null, [])->prompt(),
            ],
        );
    }

    /**
     * @param  list<MessagePart>  $parts
     */
    private function claimed(string|null $message, array $parts): ClaimedRequest
    {
        return new ClaimedRequest(
            runtimeId: 'runtime-1',
            requestId: 'request-1',
            sequence: 1,
            attempt: 1,
            operation: 'deliver',
            message: $message,
            parts: $parts,
            model: null,
            effort: null,
            script: null,
            scriptVersion: null,
            scriptParameters: [],
            scriptStep: null,
            navigationRequestId: null,
            navigationRound: null,
            sessionId: 'session-1',
            sessionProcessId: null,
            processGeneration: 1,
        );
    }
}
