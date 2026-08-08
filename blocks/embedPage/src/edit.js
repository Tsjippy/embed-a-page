import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    __experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import {
    PanelBody,
    CheckboxControl,
    Button,
    Spinner,
} from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';

const Edit = ( { attributes, setAttributes } ) => {
    const { pageId, hide, newline } = attributes;

    const selectedPage = useSelect(
        ( select ) => {
            if ( ! pageId ) {
                return null;
            }

            return select( coreDataStore ).getEntityRecord(
                'postType',
                'page',
                pageId
            );
        },
        [ pageId ]
    );

    const isLoadingPage = useSelect(
        ( select ) => {
            if ( ! pageId ) {
                return false;
            }

            return select( coreDataStore ).isResolving(
                'getEntityRecord',
                [ 'postType', 'page', pageId ]
            );
        },
        [ pageId ]
    );

    const onPageChange = ( link ) => {
        setAttributes( {
            pageId: link?.id ? parseInt( link.id, 10 ) : 0,
        } );
    };

    const clearSelectedPage = () => {
        setAttributes( {
            pageId: 0,
        } );
    };

    const linkValue = selectedPage
        ? {
              id: selectedPage.id,
              type: 'page',
              title: selectedPage.title?.rendered,
              url: selectedPage.link,
          }
        : undefined;

    let html = selectedPage?.content?.rendered || '';

    if ( newline ) {
        html += '<br />';
    }

    return (
        <>
            <InspectorControls>
                <PanelBody
                    title={ __( 'Page Embed Settings', 'tsjippy' ) }
                >
                    <CheckboxControl
                        label={ __(
                            'Only show contents on hover',
                            'tsjippy'
                        ) }
                        checked={ hide }
                        onChange={ ( checked ) =>
                            setAttributes( {
                                hide: checked,
                            } )
                        }
                    />

                    <CheckboxControl
                        label={ __( 'Add a line break', 'tsjippy' ) }
                        checked={ newline }
                        onChange={ ( checked ) =>
                            setAttributes( {
                                newline: checked,
                            } )
                        }
                    />

                    <LinkControl
                        value={ linkValue }
                        onChange={ onPageChange }
                        forceIsEditingLink
                        createSuggestion={ false }
                        settings={ [] }
                        searchInputPlaceholder={ __(
                            'Search for a page',
                            'tsjippy'
                        ) }
                        suggestionsQuery={ {
                            type: 'post',
                            subtype: 'page',
                        } }
                    />

                    { selectedPage && (
                        <>
                            <p>
                                { __(
                                    'Currently embedded page:',
                                    'tsjippy'
                                ) }{' '}
                                <strong>
                                    { decodeEntities(
                                        selectedPage.title?.rendered ||
                                            __( '(Untitled)', 'tsjippy' )
                                    ) }
                                </strong>
                            </p>

                            <p>
                                <a
									href={ `${ tsjippy.baseUrl }/wp-admin/post.php?post=${ pageId }&action=edit` }
									target="_blank"
									rel="noreferrer"
								>
									{ __( 'Edit embedded page here', 'tsjippy' ) }
								</a>
                            </p>

                            <Button
                                variant="secondary"
                                onClick={ clearSelectedPage }
                            >
                                { __(
                                    'Remove embedded page',
                                    'tsjippy'
                                ) }
                            </Button>
                        </>
                    ) }
                </PanelBody>
            </InspectorControls>

            <div { ...useBlockProps() }>
                { 
					! pageId && 
					<LinkControl
                        value={ linkValue }
                        onChange={ onPageChange }
                        forceIsEditingLink
                        createSuggestion={ false }
                        settings={ [] }
                        searchInputPlaceholder={ __(
                            'Search for a page',
                            'tsjippy'
                        ) }
                        suggestionsQuery={ {
                            type: 'post',
                            subtype: 'page',
                        } }
                    /> 
				}

                { isLoadingPage && <Spinner /> }

                { ! isLoadingPage && html && (
                    <div
                        className={
                            hide
                                ? 'tsjippy-embed-page tsjippy-embed-page--hover'
                                : 'tsjippy-embed-page'
                        }
                    >
                        <RawHTML>{ html }</RawHTML>
                    </div>
                ) }
            </div>
        </>
    );
};

export default Edit;