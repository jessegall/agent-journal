<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Models\Messages\Message;
use Tests\Support\MessagingTestCase;

/**
 * An actor sees the messages of the inboxes it is seated at, the messages it wrote and the replies to them, and
 * nothing else, on every read.
 */
final class MessageVisibilityTest extends MessagingTestCase
{
    public function test_each_actor_sees_its_inboxes_and_what_it_wrote(): void
    {
        $toBuilder = $this->ownerSends($this->inboxIdOf($this->builder), 'For the builder.');
        $toReviewer = $this->ownerSends($this->inboxIdOf($this->reviewer), 'For the reviewer.');
        $this->askNobody('For nobody.');

        $this->assertEqualsCanonicalizing([$toBuilder, $toReviewer], $this->visibleIds());

        $this->asAgent($this->builder);
        $this->assertSame([$toBuilder], $this->visibleIds());

        $this->asAgent($this->reviewer);
        $this->assertSame([$toReviewer], $this->visibleIds());
    }

    /**
     * @return list<string>
     */
    private function visibleIds(): array
    {
        return array_values(Message::query()->orderBy('id')->pluck('id')->all());
    }
}
