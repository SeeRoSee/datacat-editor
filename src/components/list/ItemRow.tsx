import {ListChildComponentProps} from "react-window";
import {ListItem, ListItemSecondaryAction} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddBox";
import ClearIcon from "@material-ui/icons/Eject";
import React from "react";
import {ItemPropsFragment} from "../../generated/types";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {getEntityType} from "../../domain";
import makeStyles from "@material-ui/core/styles/makeStyles";

export const ITEM_ROW_SIZE = 36;

export type ItemRowProps = {
    items: ItemPropsFragment[];
    disabledItems: string[];
    showRecordIcons: boolean;
    onSelect?(item: ItemPropsFragment): void;
    onAdd?(item: ItemPropsFragment): void;
    onRemove?(item: ItemPropsFragment): void;
};

const useStyle = makeStyles(theme => ({
    text: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }
}));

export default function ItemRow(props: ListChildComponentProps<ItemRowProps>) {
    const {
        data: {
            items,
            disabledItems,
            showRecordIcons,
            onSelect,
            onAdd,
            onRemove
        },
        index,
        style
    } = props;
    const classes = useStyle();

    const item = items[index];

    const entityType = getEntityType(item.__typename.substring(3), item.tags.map(t => t.id))!;
    const isDisabled = disabledItems.includes(item.id);
    const lastItem = index === items.length - 1;
    return (
        <div key={index} style={style}>
            <ListItem
                // @ts-ignore
                button={onSelect ? true : undefined}
                disabled={isDisabled}
                dense
                divider={!lastItem}
                onClick={onSelect ? () => onSelect(item) : undefined}
            >
                {showRecordIcons && (
                    <ListItemIcon>
                        <entityType.Icon/>
                    </ListItemIcon>
                )}
                <Tooltip title={item.description ?? ""} arrow>
                    <ListItemText
                        className={classes.text}
                        primary={item.name}
                        primaryTypographyProps={{
                            style: {fontStyle: item.description ? "italic" : undefined}
                        }}
                    />
                </Tooltip>
                {!isDisabled && onAdd && (
                    <ListItemSecondaryAction>
                        <IconButton
                            size="small"
                            edge="end"
                            aria-label="Hinzufügen"
                            onClick={() => onAdd(item)}
                        >
                            <AddIcon fontSize="small"/>
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
                {!isDisabled && onRemove && (
                    <ListItemSecondaryAction>
                        <IconButton
                            size="small"
                            edge="end"
                            aria-label="Entfernen"
                            onClick={() => onRemove(item)}
                        >
                            <ClearIcon fontSize="small"/>
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
        </div>
    );
}
