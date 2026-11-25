<?php

declare(strict_types=1);

namespace Tests\Feature\Activity;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Enums\Agents\ActivityType;
use App\Models\Agents\ActivityEntry;
use App\Models\Agents\Agent;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Tests\Support\MessagingTestCase;

/**
 * What agents read, ran, edited, started and posted becomes one activity entry each, at its type's level, and tells
 * open pages once; a command with a secret keeps no value and messages between agents alone are not recorded.
 */
final class ActivityRecordersTest extends MessagingTestCase
{
    protected const array TABLES = [...parent::TABLES, 'activity_entries'];

    public function test_an_agents_message_into_an_inbox_a_user_is_attached_to_is_a_post_of_that_agent(): void
    {
        $builder = ActorIdentity::ofClass(Agent::class, $this->builder->agent_id);
        $inboxId = $this->ownerInboxId();
        InboxMember::create($inboxId, $builder, CarbonImmutable::now());
        $this->asAgent($this->builder);

        $this->journal->run(new SendMessageCommand($inboxId, 'The build is green.'));

        $entry = ActivityEntry::query()->sole();
        $this->assertSame(ActivityType::Posted, $entry->type);
        $this->assertSame($this->builder->agent_id, $entry->actor()->id);
    }

    public function test_messages_between_agents_alone_are_not_recorded(): void
    {
        $reviewer = ActorIdentity::ofClass(Agent::class, $this->reviewer->agent_id);
        $inboxId = $this->journal->inboxes()->personal($reviewer)->id;
        InboxMember::create(
            $inboxId,
            ActorIdentity::ofClass(Agent::class, $this->builder->agent_id),
            CarbonImmutable::now(),
        );
        $this->asAgent($this->builder);

        $this->journal->run(new SendMessageCommand($inboxId, 'Over to you.'));

        $this->assertSame(0, ActivityEntry::query()->count());
    }
}
