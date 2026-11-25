<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

#[TimeLimit(10, 'Signed requests cover long uploads, draft publication, resources and catalogue pages.')]
final class DocumentToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;

    private const string REVISION_BODY = "# Design\nNew evidence.";

    private const string REPORT_BODY = '# Findings';

    private const array TABLES = [
        'agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'command_receipts', 'links', 'number_groups',
        'documents', 'document_revisions', 'document_drafts', 'document_closes', 'retained_drafts', 'reports',
        'record_settlements', 'text_uploads', 'text_upload_chunks', 'comments',
    ];

    public function test_a_designer_creates_and_edits_over_mcp_and_the_resource_matches_the_read_tool(): void
    {
        $designer = TestStart::start('writing-helper');
        $design = "# Design\n".str_repeat("Initial evidence.\n", 4000);
        $body = $this->upload($designer, 'document_body', $design, 'design');
        $id = $this->callMcpTool($designer, 'docs_create', [
            'title' => 'Design',
            'abstract' => 'The current design.',
            'upload_id' => $body,
            'request_key' => 'publish-design',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.doc_id');

        $edit = $this->callMcpTool($designer, 'docs_open', [
            'doc_id' => $id, 'expected_revision' => 1, 'request_key' => 'open-design',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.edit_id');
        $replacement = $this->upload($designer, 'edit_replacement', str_repeat("New evidence.\n", 4000), 'edit');
        $this->callMcpTool($designer, 'docs_edit', [
            'doc_id' => $id, 'edit_id' => $edit, 'expected_revision' => 1, 'section' => '1',
            'body' => 'Text supplied as well.', 'upload_id' => $replacement, 'request_key' => 'two-inputs',
        ])->assertJsonPath('result.structuredContent.code', 'invalid_input');
        $this->callMcpTool($designer, 'docs_edit', [
            'doc_id' => $id, 'edit_id' => $edit, 'expected_revision' => 1, 'section' => '1',
            'upload_id' => $replacement, 'request_key' => 'replace-design',
        ])->assertJsonPath('result.structuredContent.expected_revision', 2);
        $this->callMcpTool($designer, 'docs_close', [
            'doc_id' => $id, 'edit_id' => $edit, 'request_key' => 'close-design',
        ])->assertJsonPath('result.structuredContent.revision', 2);

        $first = $this->callMcpTool($designer, 'docs_read', [
            'doc_id' => $id, 'view' => 'body', 'revision' => 2,
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent');
        $this->assertStringStartsWith(self::REVISION_BODY, $first['body']);
        $this->assertNotEmpty($first['next_actions']);
        $this->sendMcp($designer, 'resources/read', ['uri' => "journal://v1/docs/{$id}/revisions/2"])
            ->assertJsonPath('result.contents.0.mimeType', 'text/markdown')
            ->assertJsonPath(
                'result.contents.0.text',
                fn (string $text) => str_starts_with($text, $first['body']),
            );
    }

    public function test_a_reviewer_files_a_report_but_cannot_discover_or_call_document_writes(): void
    {
        $reviewer = TestStart::start('read-only-helper');
        $tools = $this->catalogue($reviewer);
        $names = array_column($tools, 'name');
        $this->assertContains('reports_create', $names);
        $this->assertNotContains('docs_create', $names);

        $this->sendMcp($reviewer, 'tools/call', [
            'name' => 'docs_create', 'arguments' => ['title' => 'Forged', 'request_key' => 'forged-doc'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);

        $id = $this->callMcpTool($reviewer, 'reports_create', [
            'title' => 'Evidence',
            'abstract' => 'First report.',
            'body' => '# Findings',
            'request_key' => 'first-report',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.report_id');
        $this->callMcpTool($reviewer, 'reports_read', ['report_id' => $id, 'view' => 'body'])
            ->assertJsonPath('result.structuredContent.body', self::REPORT_BODY);
        $this->sendMcp($reviewer, 'resources/read', ['uri' => "journal://v1/reports/{$id}"])
            ->assertJsonPath('result.contents.0.mimeType', 'text/markdown')
            ->assertJsonPath('result.contents.0.text', self::REPORT_BODY);
        $this->assertDatabaseCount('documents', 0);
    }

    public function test_a_long_report_resource_names_its_next_part_and_the_parts_join_to_the_whole_body(): void
    {
        $reviewer = TestStart::start('read-only-helper');
        $body = implode("\n", array_map(fn (int $line) => "Line {$line} of the findings.", range(1, 120)));
        $id = $this->callMcpTool($reviewer, 'reports_create', [
            'title' => 'Long evidence',
            'abstract' => 'A body of several parts.',
            'body' => $body,
            'request_key' => 'long-report',
        ])->json('result.structuredContent.report_id');

        $read = '';
        $uri = "journal://v1/reports/{$id}";

        for ($part = 1; $uri !== null && $part <= 20; $part++) {
            $text = $this->sendMcp($reviewer, 'resources/read', ['uri' => $uri])->json('result.contents.0.text');
            $found = preg_match(
                '/\n\n\(This is one part of the text\. Read the next part at (\S+)\)$/',
                $text,
                $match,
            );
            $read .= $found === 1 ? substr($text, 0, -strlen($match[0])) : $text;
            $uri = $found === 1 ? $match[1] : null;
        }

        $this->assertGreaterThan(1, $part - 1);
        $this->assertSame($body, $read);
    }

    public function test_an_interrupted_upload_publishes_nothing(): void
    {
        $designer = TestStart::start('writing-helper');
        $upload = $this->callMcpTool($designer, 'uploads_begin', [
            'type' => 'document_body', 'bytes' => 4, 'digest' => hash('sha256', 'text'),
            'request_key' => 'upload-interrupted',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.upload_id');
        $this->callMcpTool($designer, 'uploads_commit', ['upload_id' => $upload, 'request_key' => 'empty-upload'])
            ->assertJsonPath('result.structuredContent.code', 'invalid_input');
        $this->callMcpTool($designer, 'docs_create', [
            'title' => 'Incomplete', 'abstract' => 'Missing bytes.', 'upload_id' => $upload,
            'request_key' => 'incomplete-doc',
        ])->assertJsonPath('result.structuredContent.code', 'invalid_input');
        $this->assertDatabaseCount('documents', 0);
    }

    private function upload(TestStart $caller, string $type, string $body, string $key): string
    {
        $upload = $this->callMcpTool($caller, 'uploads_begin', [
            'type' => $type,
            'bytes' => strlen($body),
            'digest' => hash('sha256', $body),
            'request_key' => $key.'-begin',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.upload_id');

        foreach (str_split($body, 48 * 1024) as $index => $part) {
            $this->callMcpTool($caller, 'uploads_append', [
                'upload_id' => $upload, 'index' => $index, 'text' => $part, 'digest' => hash('sha256', $part),
                'request_key' => $key.'-part-'.$index,
            ])->assertJsonPath('result.isError', false);
        }

        $this->callMcpTool($caller, 'uploads_commit', ['upload_id' => $upload, 'request_key' => $key.'-commit'])
            ->assertJsonPath('result.structuredContent.attachment_id', $upload);

        return $upload;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function catalogue(TestStart $caller): array
    {
        $tools = [];
        $arguments = [];

        do {
            $page = $this->sendMcp($caller, 'tools/list', $arguments)->assertOk()->json('result');
            $tools = [...$tools, ...$page['tools']];
            $arguments = isset($page['nextCursor']) ? ['cursor' => $page['nextCursor']] : [];
        } while ($arguments !== []);

        return $tools;
    }
}
