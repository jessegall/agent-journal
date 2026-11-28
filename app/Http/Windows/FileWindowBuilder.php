<?php

declare(strict_types=1);

namespace App\Http\Windows;

use App\Connections\Data\FilePaneData;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Enums\FileWindowStatus;
use App\Hosts\Contracts\ProjectFiles;
use App\Hosts\Contracts\ServedEnvironment;
use App\Http\Requests\Connections\FileWindowRequest;
use App\Models\Projects\ProjectBinding;
use App\Projects\Enums\ProjectReadStatus;
use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\WindowBuilder;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

final readonly class FileWindowBuilder implements WindowBuilder
{
    private const int LINE_COUNT_LIMIT = 40;

    private const int LINE_CHARACTER_LIMIT = 240;

    public function __construct(
        private ProjectFiles $files,
        private ServedEnvironment $served,
        private PageFormRequests $requests,
    ) {}

    public function build(Request $visit): FilePaneData
    {
        $path = $this->requests->forVisit(FileWindowRequest::class, $visit)->path();

        $pane = FilePaneData::build()
            ->path($path)
            ->fullUrl(route('connections.file', $path === '' ? [] : ['path' => $path], false))
            ->lines([])
            ->isTruncated(false);

        if ($path === '') {
            return $pane->status(FileWindowStatus::Empty)->finish();
        }

        $selection = ProjectBinding::findLastHeardFromIn($this->served->environmentIds());

        if ($selection->isEmpty()) {
            return $pane->status(FileWindowStatus::None)->finish();
        }

        $binding = $selection->get();

        if ($binding->readinessAt(CarbonImmutable::now()) !== BindingReadiness::Ready) {
            return $pane->status(FileWindowStatus::Offline)->finish();
        }

        $answer = $this->files->file($binding, $path);

        if ($answer->status !== ProjectReadStatus::Answered) {
            $status = $answer->status === ProjectReadStatus::Pending
                ? FileWindowStatus::Pending
                : FileWindowStatus::fromFailure($answer->failure);

            return $pane->status($status)->finish();
        }

        $lines = explode("\n", (string) $answer->text, self::LINE_COUNT_LIMIT + 1);
        $preview = array_slice($lines, 0, self::LINE_COUNT_LIMIT);

        $cut = $answer->isTruncated || count($lines) > self::LINE_COUNT_LIMIT
            || array_any($preview, fn (string $line) => mb_strlen($line) > self::LINE_CHARACTER_LIMIT);

        return $pane->status(FileWindowStatus::Ready)
            ->lines(array_map(fn (string $line) => mb_substr(rtrim($line, "\r"), 0, self::LINE_CHARACTER_LIMIT), $preview))
            ->isTruncated($cut)
            ->finish();
    }
}
