<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Contracts\Actors\ActorLabels;
use App\Contracts\Hosts\ProjectFiles;
use App\Contracts\Hosts\ServedEnvironment;
use App\Contracts\Navigation\PageResolver;
use App\Contracts\Records\CommentResolver;
use App\Data\Comments\TextCommentView;
use App\Data\Connections\FileCommentData;
use App\Data\Connections\FileThreadData;
use App\Data\Connections\FileWindowData;
use App\Enums\BindingReadiness;
use App\Enums\FileWindowState;
use App\Enums\ProjectReadFailure;
use App\Enums\ProjectReadState;
use App\Http\Requests\Connections\FileWindowRequest;
use App\Models\Agents\Agent;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectFile;
use App\Support\ActorIdentity;
use App\Support\ActorLabelSet;
use App\Support\IdListPage;
use App\Support\Layout\LayoutBodyData;
use App\Support\RecordIdentity;
use App\Values\ProjectFileAnswer;
use Carbon\CarbonImmutable;

/**
 * A File window: the one file its query names, from the connected folder heard from last, read through its host and
 * split into lines no longer and no more than a window shows.
 */
final readonly class FileWindowResolver implements PageResolver
{
    /**
     * The most lines a File window shows; the rest of the file is left out and the window says so.
     */
    public const int LINE_COUNT_LIMIT = 5000;

    /**
     * The most characters a File window shows of one line; a longer line is cut and named.
     */
    public const int LINE_CHARACTER_LIMIT = 2000;

    public function __construct(
        private ProjectFiles $files,
        private ServedEnvironment $served,
        private FileWindowRequest $request,
        private CommentResolver $comments,
        private ActorLabels $labels,
    ) {}

    public function read(): FileWindowData
    {
        $path = $this->request->path();
        $found = ProjectBinding::lastHeardFromIn($this->served->environmentIds());

        if (! $found->isDefined()) {
            return $this->window(FileWindowState::None, $path);
        }

        if ($path === '') {
            return $this->window(FileWindowState::Empty, $path);
        }

        $binding = $found->get();

        if ($binding->readinessAt(CarbonImmutable::now()) !== BindingReadiness::Ready) {
            return $this->window(FileWindowState::Offline, $path);
        }

        $answer = $this->files->file($binding, $path);

        return match ($answer->state) {
            ProjectReadState::Pending => $this->window(FileWindowState::Pending, $path),
            ProjectReadState::Answered => $this->answered($binding, $answer),
            ProjectReadState::Failed, ProjectReadState::Expired => $this->window($this->failedState($answer), $path),
        };
    }

    private function failedState(ProjectFileAnswer $answer): FileWindowState
    {
        return match ($answer->failure) {
            ProjectReadFailure::Binary => FileWindowState::Binary,
            ProjectReadFailure::TooLarge => FileWindowState::TooLarge,
            default => FileWindowState::Failed,
        };
    }

    /**
     * The file's lines, at most LINE_COUNT_LIMIT of them and each at most LINE_CHARACTER_LIMIT characters; a file the
     * host or this window cut short is too large to show whole.
     */
    private function answered(ProjectBinding $binding, ProjectFileAnswer $answer): FileWindowData
    {
        $read = preg_split('/\r?\n/', (string) $answer->text) ?: [];
        $isTruncated = $answer->isTruncated || count($read) > self::LINE_COUNT_LIMIT;
        $lines = [];
        $cutLineNumbers = [];

        foreach (array_slice($read, 0, self::LINE_COUNT_LIMIT) as $index => $line) {
            if (mb_strlen($line) > self::LINE_CHARACTER_LIMIT) {
                $cutLineNumbers[] = $index + 1;
            }

            $lines[] = mb_substr($line, 0, self::LINE_CHARACTER_LIMIT);
        }

        return FileWindowData::from([
            'state' => $isTruncated ? FileWindowState::TooLarge : FileWindowState::Ready,
            'name' => basename($answer->path),
            'path' => $answer->path,
            'isMarkdown' => $this->isMarkdown($answer->path),
            'lines' => $lines,
            'cutLineNumbers' => $cutLineNumbers,
            'isTruncated' => $isTruncated,
            'digest' => $answer->digest,
            'size' => $answer->size,
            ...$this->markdownOf($answer->path, $lines),
            ...$this->commentsOf($binding, $answer, $lines),
            ...$this->recipientOf($binding),
        ]);
    }

    private function window(FileWindowState $state, string $path): FileWindowData
    {
        return FileWindowData::from([
            'state' => $state,
            'name' => basename($path),
            'path' => $path,
            'isMarkdown' => $this->isMarkdown($path),
            'lines' => [],
            'cutLineNumbers' => [],
            'isTruncated' => false,
            'digest' => null,
            'size' => null,
            'commentTarget' => null,
            'threads' => [],
            'recipientId' => null,
            'recipientName' => null,
            'tellAddress' => route('connections.file-comments.tell', absolute: false),
        ]);
    }

    /**
     * The file's record, once a version of it is kept, and the threads on the version shown, grouped by their lines.
     *
     * @param  list<string>  $lines
     * @return array{commentTarget: string|null, threads: list<FileThreadData>}
     */
    private function commentsOf(ProjectBinding $binding, ProjectFileAnswer $answer, array $lines): array
    {
        $found = ProjectFile::atPath($binding->id, $answer->path);

        if (! $found->isDefined()) {
            return [
                'commentTarget' => null,
                'threads' => [],
            ];
        }

        $file = $found->get();
        $target = new RecordIdentity(ProjectFile::LINK_TYPE, $file->id);
        $listed = $this->comments->list($target, new IdListPage(limit: IdListPage::LARGEST_LIMIT));

        $onVersion = array_values(array_filter(
            $listed->comments,
            fn ($comment) => $comment instanceof TextCommentView && $comment->anchor->versionId === $answer->digest,
        ));

        $labels = $this->labels->labelsFor(array_map(self::authorOf(...), $onVersion));
        $byRange = [];

        foreach ($onVersion as $comment) {
            $byRange["{$comment->anchor->firstLine}-{$comment->anchor->lastLine}"][] = $comment;
        }

        $threads = array_map(fn (array $comments) => $this->thread($comments, $lines, $labels), array_values($byRange));

        usort($threads, fn (FileThreadData $first, FileThreadData $second) => $first->firstLine <=> $second->firstLine);

        return [
            'commentTarget' => "file {$file->number}",
            'threads' => $threads,
        ];
    }

    /**
     * One range's comments as a thread: its lines, the text of those lines in the version shown, and each comment.
     *
     * @param  non-empty-list<TextCommentView>  $comments
     * @param  list<string>  $lines
     */
    private function thread(array $comments, array $lines, ActorLabelSet $labels): FileThreadData
    {
        $anchor = $comments[0]->anchor;
        $quoted = array_slice($lines, $anchor->firstLine - 1, $anchor->lastLine - $anchor->firstLine + 1);

        return FileThreadData::from([
            'firstLine' => $anchor->firstLine,
            'lastLine' => $anchor->lastLine,
            'quote' => implode(' ', $quoted),
            'versionLabel' => $anchor->versionLabel,
            'comments' => array_map(fn (TextCommentView $comment) => FileCommentData::from([
                'id' => $comment->comment->id,
                'author' => $labels->nameOf(self::authorOf($comment)) ?? '',
                'createdAt' => $comment->comment->createdAt,
                'body' => $comment->comment->body,
            ]), $comments),
        ]);
    }

    private static function authorOf(TextCommentView $comment): ActorIdentity
    {
        return new ActorIdentity($comment->comment->authorType, $comment->comment->authorId);
    }

    /**
     * The project's main agent, whom a comment on its files is sent to, and the address that tells it.
     *
     * @return array{recipientId: string, recipientName: string, tellAddress: string}
     */
    private function recipientOf(ProjectBinding $binding): array
    {
        $agent = Agent::query()->whereKey($binding->main_agent_id)->firstOrFail();

        return [
            'recipientId' => $agent->id,
            'recipientName' => $agent->name,
            'tellAddress' => route('connections.file-comments.tell', absolute: false),
        ];
    }

    /**
     * A Markdown file's lines as the journal's safe HTML; nothing for any other file.
     *
     * @param  list<string>  $lines
     * @return array{markdown?: LayoutBodyData}
     */
    private function markdownOf(string $path, array $lines): array
    {
        if ($this->isMarkdown($path)) {
            return ['markdown' => LayoutBodyData::fromMarkdown(implode("\n", $lines))];
        }

        return [];
    }

    private function isMarkdown(string $path): bool
    {
        return in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), [
            'md',
            'markdown',
        ], true);
    }
}
