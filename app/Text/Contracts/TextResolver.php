<?php

declare(strict_types=1);

namespace App\Text\Contracts;

use App\Reads\Values\PageSize;
use App\Records\Support\RecordIdentity;
use App\Text\Data\TextSections;
use App\Text\Data\TextVersionSummary;
use App\Text\Support\TextPart;
use App\Text\Support\TextSelection;

/**
 * Reads the text of a record the caller may read, one version at a time and a bounded part at a time: which version,
 * its sections, and a part of its lines. A missing record and one the caller may not read look the same.
 */
interface TextResolver
{
    /**
     * The version named, or the current one for none.
     */
    public function version(RecordIdentity $target, string|null $version = null): TextVersionSummary;

    /**
     * The sections after the given number, zero for the first page.
     */
    public function sections(RecordIdentity $target, string $version, int $afterSection, PageSize $size): TextSections;

    /**
     * A bounded part of the version's lines, with the line to read on from when it was cut.
     */
    public function read(RecordIdentity $target, string $version, TextSelection $selection): TextPart;
}
