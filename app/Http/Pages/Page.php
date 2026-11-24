<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutDialogData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\ListEmpty;

/**
 * What every page of the app builds the same way: a creation dialog, written by hand or with an agent, and the empty
 * state of a list whose filters match nothing. Each subject's page extends it, and each page extends its subject's.
 */
abstract readonly class Page
{
    /**
     * A dialog that creates a record: its opener, its form and fields, and a send button; when an agent can draft
     * the record, the dialog offers both ways.
     *
     * @param  list<LayoutPartData>  $fields
     */
    protected function creationDialog(
        CreationDialog $creation,
        LayoutPartData $opener,
        LayoutFormData $form,
        array $fields,
    ): LayoutPartData {
        $dialog = LayoutDialogData::from([
            'title' => $creation->title,
            'confirmation' => $creation->confirmation,
            'guidedNoun' => $creation->guidedNoun,
            'ways' => $creation->ways(),
        ]);

        return LayoutPartData::dialog(
            $creation->key,
            $dialog,
            $opener,
            $form,
            $fields,
            [LayoutPartData::action('send', $creation->sendLabel, LayoutActionData::submitting(), 'primary')],
        );
    }

    /**
     * The empty state of a list whose filters match nothing, with the action that clears them.
     *
     * @param  array<string, string>  $cleared  each filter and the value that clears it
     */
    protected function nothingMatches(string $message, string $clearLabel, array $cleared): ListEmpty
    {
        return ListEmpty::offering(
            $message,
            LayoutPartData::action('clear', $clearLabel, LayoutActionData::changing($cleared)),
        );
    }
}
