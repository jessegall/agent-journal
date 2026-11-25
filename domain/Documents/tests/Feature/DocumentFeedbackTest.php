<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Models\Messages\Message;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Tests\TestCase;
use Tests\Support\MessagingFixtures;
use Tests\Support\TestProjects;

/**
 * Ask for feedback on a document sends the chosen agent a message in their chat asking for feedback on the document,
 * or on the lines the reader chose; an agent out of the reader's sight is refused and nothing is sent.
 */
final class DocumentFeedbackTest extends TestCase
{
    use MessagingFixtures;

    protected const array TABLES = self::MESSAGING_TABLES;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpMessaging();

        $this->journal->run(new CreateDocumentCommand(
            'Design',
            'What we build',
            "# Goal\nShip it.\nThen rest.\n",
            TestProjects::local()->id,
        ));
    }

    public function test_asking_an_agent_for_feedback_on_the_document_sends_them_a_message(): void
    {
        $this->actingAs($this->owner)
            ->post('/documents/docs/1/feedback', [
                'agent' => $this->builder->agent_id,
                'request_key' => 'ask-1',
            ])
            ->assertRedirect();

        $this->assertTrue($this->wasSent('Please give me feedback on doc 1.'));
    }

    public function test_asking_for_feedback_on_lines_names_them(): void
    {
        $this->actingAs($this->owner)
            ->post('/documents/docs/1/feedback', [
                'agent' => $this->builder->agent_id,
                'request_key' => 'ask-2',
                'first_line' => 2,
                'last_line' => 3,
            ])
            ->assertRedirect();

        $this->assertTrue($this->wasSent('Please give me feedback on lines 2-3 of doc 1.'));
    }

    public function test_an_agent_the_reader_cannot_see_is_refused_and_nothing_is_sent(): void
    {
        $this->actingAs($this->owner)
            ->post('/documents/docs/1/feedback', [
                'agent' => '01JZZZZZZZZZZZZZZZZZZZZZZZ',
                'request_key' => 'ask-3',
            ]);

        $this->assertFalse($this->wasSent('Please give me feedback on doc 1.'));
    }

    private function wasSent(string $body): bool
    {
        return Message::query()->withoutGlobalScopes()->where('body', $body)->exists();
    }
}
