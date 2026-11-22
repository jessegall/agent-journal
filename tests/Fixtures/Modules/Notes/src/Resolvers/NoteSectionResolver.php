<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Resolvers;

use App\Contracts\Sessions\SessionResolver;
use App\Contracts\Navigation\SectionResolver;
use App\Declarations\SlotContext;
use Tests\Fixtures\Modules\Notes\Data\NoteSectionData;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * How many notes the calling actor has, in Chat's dock; the chosen session is checked again through Core.
 */
final readonly class NoteSectionResolver implements SectionResolver
{
    public function __construct(private SessionResolver $sessions) {}

    public function read(SlotContext $context): NoteSectionData
    {
        $this->sessions->requireActive((string) $context->id);

        return NoteSectionData::from(['count' => Note::query()->forActor()->count()]);
    }
}
